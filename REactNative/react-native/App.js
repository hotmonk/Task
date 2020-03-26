import Routes from "./Routers/HomeRoutes.js";
import React, { Component } from "react";
import { AppRegistry, View } from "react-native";
import { loadSeller } from "./actions/sellerAuthActions";
import { loadVendor } from "./actions/vendorAuthActions";

import { Provider } from "react-redux";
import store from "./store";

class App extends Component {
  componentDidMount() {
    store.dispatch(loadSeller());
    store.dispatch(loadVendor());
  }

  render() {
    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    );
  }
}
export default App;
AppRegistry.registerComponent("task", () => App);
