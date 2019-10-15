import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class vendorProfile extends Component {

    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
          // Check for register error
          if (error.id === 'VENDOR_REGISTER_FAIL') {
            this.setState({ msg: error.msg.msg });
          } else {
            this.setState({ msg: null });
          }
        }
      }

    static propTypes = {
        vendorData:PropTypes.isRequired,
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        clearErrors: PropTypes.func.isRequired
      };

      render(){
          return (
            <div>
                <h1>welcome {this.props.vendorData.name}</h1>
                <p>Here are all the details you entered</p>
                <h3>Name:{this.props.vendorData.name}</h3>
                <h3>Email:{this.props.vendorData.email}</h3>
                <h3>Contact:{this.props.vendorData.contact}</h3>
                <h3>Address:{this.props.vendorData.address}</h3>
                <button>Edit Details</button>
            </div>
          );
      }
}

const mapStateToProps = state => ({
    vendorData:state.vendorAuth.vendor,
    isAuthenticated: state.vendorAuth.isAuthenticated,
    error: state.error
  });

export default connect(mapStateToProps,null)(vendorProfile);
  