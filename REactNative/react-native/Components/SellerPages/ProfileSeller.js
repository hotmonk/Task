import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View,TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';

class sellerProfile extends Component {

    static propTypes = {
        sellerData:PropTypes.isRequired,
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        clearErrors: PropTypes.func.isRequired
      };

      render(){
          return (
            <View>
                <Text>welcome {this.props.sellerData.name}</Text>
                <Text>Here are all the details you entered</Text>
                <Text>Name:{this.props.sellerData.name}</Text>
                <Text>Email:{this.props.sellerData.email}</Text>
                <Text>Contact:{this.props.sellerData.contact}</Text>
                <Text>Address:{this.props.sellerData.address}</Text>
                <Text>Edit Details</Text>
                <View>
                   <Text onPress={() => Actions.newItem()}>Add Items For Sale</Text>
                </View>
                <View>
                   <Text onPress={() => Actions.Item()}>View All items added by you</Text>
                </View>
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
