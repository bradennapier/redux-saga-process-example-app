import { fork, cancelled } from 'redux-saga/effects';
import { runProcesses } from 'redux-saga-process';

export default function* rootSaga() {
  try {
    yield fork(runProcesses);
  } catch (e) {
    console.error('[root-saga]: An Uncaught Error Occurred: ', e.message);
  } finally {
    if (yield cancelled()) {
      // Called when our root saga is cancelled, this probably means
      // we are being hot reloaded.
    }
  }
}
