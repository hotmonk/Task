import React, { Component, Fragment } from 'react';
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
        <Button onClick={this.props.vendorLogout}>
          Logout Vendor
        </Button>
      </Fragment>
    );
  }
}

export default connect(
  null,
  { vendorLogout }
)(VendorLogout);
