import React, { Component } from 'react';
import logo from './logo.svg';
import './Home.css';

import config from 'utils/config';
import { connectProcesses } from 'redux-saga-process';
import { connect } from 'react-redux';

class Home extends Component {
  render() {
    // console.log(this);
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <img
            src="https://s3.amazonaws.com/dash-os/img/logo/white.png"
            className="Dash-logo"
            alt="dash os"
          />

        </div>
        <div className="App-intro">
          <h2>{config('app.name')}</h2>
          {String(this.props.modal.isOpened)}{' '}
          <button onClick={e => this.props.modalOpen('myModal')}>
            {' '}Toggle
          </button>
        </div>
      </div>
    );
  }
}

const ConnectToRedux = ({ actions, selectors }) =>
  connect(
    state => ({
      modal: selectors.modal(state),
    }),
    actions,
  )(Home);

export default connectProcesses(
  {
    modal: ['actions', 'selectors'],
  },
  ConnectToRedux,
);
