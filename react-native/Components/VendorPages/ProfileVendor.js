import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View,TextInput } from 'react-native';

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
            <View>
                <Text>welcome {this.props.vendorData.name}</Text>
                <Text>Here are all the details you entered</Text>
                <Text>Name:{this.props.vendorData.name}</Text>
                <Text>Email:{this.props.vendorData.email}</Text>
                <Text>Contact:{this.props.vendorData.contact}</Text>
                <Text>Address:{this.props.vendorData.address}</Text>
                <Text>Edit Details</Text>
            </View>
          );
      }
}

const mapStateToProps = state => ({
    vendorData:state.vendorAuth.vendor,
    isAuthenticated: state.vendorAuth.isAuthenticated,
    error: state.error
  });

export default connect(mapStateToProps,null)(vendorProfile);
