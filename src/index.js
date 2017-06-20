import React from 'react';
import { render } from 'react-dom';
import store from './app/configure/store';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

render(<App store={store} />, document.getElementById('root'));
registerServiceWorker();
