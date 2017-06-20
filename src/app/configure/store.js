import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import reducers from './reducers';
import config from 'utils/config';
import rootSaga from 'sagas';

let store;

/**
 * configureStore
 *
 * @param  {Object} [initialState={}] [description]
 * @param  {Object} [hooks={}]        [description]
 * @return {[type]}                   [description]
 */
function configureStore(initialState = {}, hooks = {}) {
  const reduxConfig = config('redux');

  // A Map which stores our configured middleware so that we
  // can reference it later if needed.
  const configuredMiddleware = new Map();

  if (reduxConfig.use.logger) {
    configuredMiddleware.set('redux-logger', createLogger(reduxConfig.logger));
  }

  if (reduxConfig.use.sagas) {
    configuredMiddleware.set('redux-saga', createSagaMiddleware());
  }

  const enhancers = compose(
    // Middleware Enhancer
    applyMiddleware(...[...configuredMiddleware.values()]),
    // Add Extra Enhancers if needed
    ...(hooks.onEnhancers ? hooks.onEnhancers(configuredMiddleware) : []),
  );

  store = createStore(reducers, initialState, enhancers);

  if (hooks.onCreate) {
    hooks.onCreate(store, configuredMiddleware);
  }

  // our main saga task which allows us to hot reload if desired by cancelling
  // and re-initiating the sagas & processes (unless spawned).
  let sagaTask =
    configuredMiddleware.has('redux-saga') &&
    configuredMiddleware.get('redux-saga').run(rootSaga);

  if (reduxConfig.hot) {
    module.hot.accept('./reducers', () => {
      let awaitPromise;
      if (sagaTask) {
        sagaTask.cancel();
        awaitPromise = sagaTask.done;
      }
      Promise.resolve(awaitPromise).then(() => {
        Promise.all([
          import('./reducers'),
          configuredMiddleware.has('redux-saga') && import('sagas'),
        ]).then(([new_reducers, new_sagas]) => {
          store.replaceReducer(new_reducers.default);
          if (new_sagas) {
            sagaTask = configuredMiddleware
              .get('redux-saga')
              .run(new_sagas.default);
          }
          store.dispatch({
            type: 'HOT_RELOADED',
          });
        });
      });
    });
  }

  return store;
}

configureStore();

export default store;
