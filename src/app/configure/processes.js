import config from 'utils/config';
import { buildProcesses } from 'redux-saga-process';

import * as processes from 'processes';

/**
 * handleConfigureProcess (optional)
 * @param  {Function} processFactory
 * @param  {String}   processID
 * @param  {String}   processPath
 * @return {Process|ProcessConfiguration}
 *
 * if we encounter a function that is not a process, this is called to allow
 * us to build the process.  If we return a valid process then it will be
 * built and added to our processes.
 *
 * This can be used to modify the configuration and behavior of your
 * Processes if needed.  In most cases you can ignore this.
 *
 */
function handleConfigureProcess(processFactory, processID, processPath) {
  return processFactory({
    /* Process Specific Configuration */
    ...config('processes.config'),
  });
}

export default function configureProcesses() {
  console.log('Config Proc');
  /**
   * buildProcesses
   *
   *   buildProcesses is the first step in setting up redux-saga-process.
   *   It requires at least it's first argument.
   *
   * @arg {Object} processes *Required*
   *   An Object which has your processes within it.  The Object will be
   *   traversed if needed.  Processes that are nested will use the given
   *   structure to infer their category.
   *   {
   *    ui: {
   *      modal: ModalProcess <-- path & id is ui.modal
   *    },
   *    counter: CounterProcess <-- path & id is counter
   *   }
   * @arg {Object} globalProcessConfiguration
   *   Allows modifying the global configuration for redux-saga-process.  Any
   *   process-level configuration will overwrite the global level if defined.
   * @arg {Function} handleConfigureProcess
   *   An optional function which will be called when a process factory (function)
   *   is detected which is not a Process.  This can be used to configure and pass
   *   custom arguments to a factory which will return your Process.
   *
   * @returns {Object}
   *   @param {Array} processIDs
   *     An array of processIDs that were built successfully.
   *   @param {Object} processReducers
   *     An object containing a compiled set of reducers to send to
   *     combineReducers.
   */
  const builtProcesses =
    (config('processes.enabled') &&
      buildProcesses(
        processes,
        {
          /*
            Redux Saga Process Package Configuration Options
            | We can configure redux-saga-process to change it's overall
            | behavior if needed.  See /src/app/shared/utils/config.js for
            | the default configuration that we are adding here.
          */
          ...config('processes.config'),
        },
        handleConfigureProcess,
      )) ||
    {};

  return builtProcesses;
}
