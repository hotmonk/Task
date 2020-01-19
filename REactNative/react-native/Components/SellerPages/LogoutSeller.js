import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View,TextInput } from 'react-native';
import { sellerLogout } from '../../actions/sellerAuthActions';
import PropTypes from 'prop-types';

export class SellerLogout extends Component {
  static propTypes = {
    sellerLogout: PropTypes.func.isRequired
  };

  render() {
    return (
      <Fragment>
        <Text onPress={this.props.sellerLogout}>
          Logout Seller
        </Text>
      </Fragment>
    );
  }
}

export default connect(
  null,
  { sellerLogout }
)(SellerLogout);
