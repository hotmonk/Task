import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View,TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import SellerLogout from './LogoutSeller';

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
        if(!this.props.isAuthenticated){
          this.props.history.push('sellerLogin');
        }
      }
      render(){
          return (
        <View>
            {this.props.isAuthenticated ? (
              <View>
                <SellerLogout />
            <View>
                <Text>welcome {this.props.sellerData.name}</Text>
                <Text>Here are all the details you entered</Text>
                <Text>Name:{this.props.sellerData.name}</Text>
                <Text>Email:{this.props.sellerData.email}</Text>
                <Text>Contact:{this.props.sellerData.contact}</Text>
                <Text>Address:{this.props.sellerData.address}</Text>
                <Text>Edit Details </Text>
                <View>
                   <Text onPress={() => Actions.sellerNewItem()}>Add Items For Sale</Text>
                </View>
                <View>
                   <Text onPress={() => Actions.sellerItems()}>View All items added by you</Text>
                </View>
            </View>
            </View>
              ) : (
                <Text>Please Login First!</Text>
              )}
            </View>
          );
      }
}

const mapStateToProps = state => ({
    sellerData:state.sellerAuth.seller,
    isAuthenticated: state.sellerAuth.isAuthenticated,
    error: state.error
  });

export default connect(mapStateToProps,null)(sellerProfile);
