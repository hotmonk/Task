import React, { Component } from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import HomeRoutes from './Routers/HomeRoutes.js';

import { Provider } from 'react-redux';
import store from './store';
import { loadSeller } from './actions/sellerAuthActions';
import { loadVendor } from './actions/vendorAuthActions';

class App extends Component {
  componentDidMount() {
    store.dispatch(loadSeller());
  }

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <HomeRoutes />
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
