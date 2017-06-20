import { combineReducers } from 'redux';

import config from 'utils/config';

import configureProcesses from './processes';

const { processReducers } =
  (config('processes.enabled') && configureProcesses()) || {};

/**
 * combineReducers (redux)
 * @type {[type]}
 */
const reducers = combineReducers({
  /* add any extra reducers here */
  foo: (state, action) => ({}),
  ...processReducers,
});

export default reducers;
