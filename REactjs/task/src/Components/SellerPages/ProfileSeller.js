import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class sellerProfile extends Component {

    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
          // Check for register error
          if (error.id === 'SELLER_REGISTER_FAIL' || error.id === 'SELLER_LOGIN_FAIL') {
            this.setState({ msg: error.msg.msg });
          } else {
            this.setState({ msg: null });
          }
        }
      }

    static propTypes = {
        sellerData:PropTypes.isRequired,
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        clearErrors: PropTypes.func.isRequired
      };

      render(){
          return (
            <div>
                <h1>welcome {this.props.sellerData.name}</h1>
                <p>Here are all the details you entered</p>
                <h3>Name:{this.props.sellerData.name}</h3>
                <h3>Email:{this.props.sellerData.email}</h3>
                <h3>Contact:{this.props.sellerData.contact}</h3>
                <h3>Address:{this.props.sellerData.address}</h3>
                <button>Edit Details</button>
            </div>
          );
      }
}

const mapStateToProps = state => ({
    sellerData:state.sellerAuth.seller,
    isAuthenticated: state.sellerAuth.isAuthenticated,
    error: state.error
  });

export default connect(mapStateToProps,null)(sellerProfile);
  
