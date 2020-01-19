import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View,TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';

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
                <View>
                   <Text onPress={() => Actions.vendorNewsfeed()}>View Items For Sale</Text>
                </View>
                <View>
                    <Text onPress={() => Actions.vendorViewBuyedItems()}>View All items purchased by you</Text>
                </View>
                <View>
                      <Text onPress={() => Actions.vendorNewWasteType()}>Request for new category or sub-category</Text>
                </View>
                <View>
                      <Text onPress={() => Actions.vendorChooseCat()}>choose categories to quote for</Text>
                </View>
                <View>
                      <Text onPress={() => Actions.vendorEditPrice()}>edit quoted price for items</Text>
                </View>
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
