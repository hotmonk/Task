import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';
import { Actions } from 'react-native-router-flux';
import {baseURL} from '../../config/constants.js';
import { Text, FlatList, StyleSheet,View } from 'react-native';

class Payment extends Component{
    constructor(props)
    {
        super(props);
        this.state={
            item:null,
            price:0
        }
        const config = {
            headers: {
            'Content-type': 'application/json'
            }
        };
        axios.get(baseURL+'/vendor/viewItem/'+this.props.match.params.itemId,config)
            .then(response=>{
                this.setState({
                    item:response.data
                });
            })
            .catch(err=>{
                console.log(err);
            })
    }

    componentDidUpdate()
    {
        if(!this.props.isAuthenticated){
            Actions.vendorLogin()
        }
    }

    purchase()
    {
        const config = {
            headers: {
            'Content-type': 'application/json'
            }
        };

        const body=JSON.stringify({
            item_id:this.state.item.id,
            price:100
        })
        axios.post(baseURL+'/vendor/'+this.props.vendor._id+'/transaction', body ,config)
            .then(response=>{
                console.log(response.data);
                Actions.vendorViewBuyedItems()
            })
            .catch(error=>{
                console.log(error);
            })
    }
    
    render(){
        return(
         <View>  
             {console.log(this.state.item)}
            <Text> Category name: </Text>  <Text>{this.state.item.cat_id.name}</Text>
            <Text> Sub-Category name: </Text>  <Text>{this.state.item.sub_cat_id.name}</Text>
            <Text> quantity: </Text>   <Text>{this.state.item.quantity}</Text>
            <Text> Amount to be paid: </Text>  <Text>{this.state.item.quantity*10}</Text>
            <Button onPress={this.Purchase}>Make Payment</Button>
                <Text onPress={() => Actions.vendorViewBuyedItems()}>View all purchased items</Text>
                <Text onPress={() => Actions.vendorProfile()}>Profile</Text>
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