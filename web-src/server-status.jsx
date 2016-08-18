import React from 'react';
import Fetch from './fetch';

const { Component } = React;

export default class ServerStatus extends Fetch(Component) {
  constructor (props) {
    super(props);
    this.state = {
      serverTime: 'Sync...'
    };
    this.timer = 0;
  }

  componentDidMount () {
    this.timer = setInterval( (() => {
      this.fetch('/server-status/time').then( ((json) => {
        let date = new Date(json.data);
        this.setState({serverTime: date.toLocaleDateString() + ' ' + date.toLocaleTimeString()});
      }).bind(this)).catch( ((text) => {
        this.setState({serverTime: text});
      }).bind(this));
    }).bind(this), 1000);
  }
  componentWillUnmount () {
    clearInterval(this.timer);
  }

  render () {
    let { state } = this;
    return (
      <div>
        <date>{state.serverTime}</date>
      </div>
    );
  }

}
