import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { sellerLogout } from '../../actions/sellerAuthActions';
import PropTypes from 'prop-types';

export class SellerLogout extends Component {
  static propTypes = {
    sellerLogout: PropTypes.func.isRequired
  };

  render() {
    return (
      <Fragment>
        <button className="btn btn-outline-light my-2 my-sm-0" onClick={this.props.sellerLogout}>
          Logout Seller
        </button>
      </Fragment>
    );
  }
}

export default connect(
  null,
  { sellerLogout }
)(SellerLogout);