import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { clearErrors } from '../../actions/errorActions';
import { StyleSheet, Text, View,TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import VendorLogout from './LogoutVendor';

class Payment extends Component{
    componentDidUpdate()
    {
        if(!this.props.isAuthenticated){
            this.props.history.push('vendorLogin');
        }
    }

    render(){
        return(
         <View>  
            <Text> Payment Successful! </Text>   
            <View>
                <Text onPress={() => Actions.vendorViewBuyedItems()}>View all purchased items</Text>
            </View>
            <View>
                <Text onPress={() => Actions.vendorProfile()}>Profile</Text>
            </View>
         </View> 
        )
    }

}

const mapStateToProps = state => ({
    token:state.vendorAuth.token,
    vendor:state.vendorAuth.vendor,
    isAuthenticated: state.vendorAuth.isAuthenticated,
    error: state.error
  });
  
  export default connect(
    mapStateToProps,
    { clearErrors }
  )(Payment);