import React, { Component } from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import HomeRoutes from './Routers/HomeRoutes.js';

import { Provider } from 'react-redux';
import store from './store';
import { loadSeller } from './actions/sellerAuthActions';
import { loadVendor } from './actions/vendorAuthActions';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  componentDidMount() {
    store.dispatch(loadSeller());
    store.dispatch(loadVendor());
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
