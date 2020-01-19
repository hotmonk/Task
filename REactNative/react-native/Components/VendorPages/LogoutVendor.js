import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View,TextInput } from 'react-native';
import { connect } from 'react-redux';
import { vendorLogout } from '../../actions/vendorAuthActions';
import PropTypes from 'prop-types';

export class VendorLogout extends Component {
  static propTypes = {
    vendorLogout: PropTypes.func.isRequired
  };

  render() {
    return (
      <Fragment>
        <Text onPress={this.props.vendorLogout}>
          Logout Vendor
        </Text>
      </Fragment>
    );
  }
}

export default connect(
  null,
  { vendorLogout }
)(VendorLogout);
