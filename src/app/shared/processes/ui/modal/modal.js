import { Process } from 'redux-saga-process';

import { call, put, select } from 'redux-saga/effects';

import { createSelector } from 'reselect';

import _ from 'lodash';

const build_config = config => ({
  reduces: 'modal',
  pid: 'modal',
  log: false,
  ...config,
});

// const processLoadsOnAction = 'ACTIVATE_MODALS';

const processInitialState = {
  isOpened: false,
  modalID: undefined,
  modalProps: {},
};

const processActionCreators = {
  modalOpen: ['modalID', 'modalProps'],
  modalClose: ['force'],
};

const processActionRoutes = {
  modalOpen: 'handleModalOpen',
  modalClose: 'handleModalClose',
};

const processReducer = {
  modalState: (state, { type, ...action }) => ({
    ...state,
    ...action,
  }),
};

export default function configureModalsProcess(_config) {
  const config = build_config(_config);

  const processSelectors = {};

  const stateKeySelector = state => state[config.reduces];

  processSelectors.modalProps = createSelector(
    stateKeySelector,
    modal => modal.modalProps,
  );

  processSelectors.modal = createSelector(
    stateKeySelector,
    processSelectors.modalProps,
    (modal, modalProps) => ({
      isOpened: modal.isOpened,
      modalID: modal.modalID,
      modalProps,
    }),
  );

  const processConfig = {
    pid: config.pid,
    reduces: config.reduces,
    wildcard: config.wildcard,
  };

  class ModalsProcess extends Process {
    /**
     * handleModalOpen
     *   Triggered when MODAL_OPEN is dispatched.
     * @arg {ReduxAction}
     *   @param {String} modalID The id of the modal to open
     *   @param {Object} modalProps Optional props for the modal
     */
    *handleModalOpen({ modalID, modalProps }) {
      const modal = yield select(stateKeySelector);
      if (modal.modalID === modalID) {
        // If we try to open a modal which is already opened it will instead
        // be closed
        yield call([this, this.handleModalClose], {}, modal);
      } else {
        yield put({
          type: 'MODAL_STATE',
          isOpened: true,
          modalID,
          modalProps,
        });
      }
    }

    /**
     * handleModalOpen
     *   Triggered when MODAL_OPEN is dispatched.
     * @arg {ReduxAction}
     *   @param {Boolean} force If true, allows closing a modal with isCloseable
     *                          set to false.
     * @arg {Modal}
     *   When called from handleModalOpen, it includes the modal so we don't
     *   need to call the selector a second time.
     */
    *handleModalClose({ force }, _modal) {
      const modal = _modal || (yield select(stateKeySelector));
      if (force !== true && _.get(modal, 'modalProps.isCloseable') === false) {
        if (config.log) {
          return console.info(
            '[modal-process]: Tried to close a modal which is not allowed to close.',
          );
        }
      } else if (_.get(modal, 'modalID') !== undefined) {
        yield put({
          type: 'MODAL_STATE',
          isOpened: false,
          modalID: undefined,
          modalProps: {},
        });
      }
    }

    *processStarts(processID) {
      yield put({
        type: 'PROCESS_STARTS',
        processID,
      });
    }
  }

  return {
    process: ModalsProcess,
    config: processConfig,
    initialState: processInitialState,
    // loadOnAction: processLoadsOnAction,
    actionCreators: processActionCreators,
    actionRoutes: processActionRoutes,
    selectors: processSelectors,
    reducer: processReducer,
  };
}
