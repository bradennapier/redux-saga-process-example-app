import React, { Component } from 'react';

import { Provider } from 'react-redux';
import Home from './app/screens/Home';

class App extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <Home />
      </Provider>
    );
  }
}

export default App;
