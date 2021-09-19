import React, { Component } from 'react';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
      return (
          <>
              <h1>Hello</h1>
              <h3>{App.displayName}</h3>
          </>

    );
  }
}
