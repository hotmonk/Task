import React, {Component} from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';
import VendorLogout from './LogoutVendor';
import { StyleSheet, Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {baseURL} from '../../config/constants.js';

class ViewBuyedItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items:null,
            item:null
        }
        this.handleBack=this.handleBack.bind(this);
    }

    componentDidMount(){
        if(this.props.isAuthenticated){
            // Headers
            const config = {
                headers: {
                'Content-type': 'application/json'
                }
            };
            axios.get(baseURL+'/vendor/'+this.props.vendor._id+'/viewBuyedItem', config)
                .then(response=>{
                    this.setState({
                        items:response.data
                    })
                })
                .catch(error=>{
                    console.log(error);
                })
          }
    }
    componentDidUpdate()
    {
        if(!this.props.isAuthenticated){
            this.props.history.push('vendorLogin');
        }
    }

      handleList(item){
          this.setState({
              item
          });
      }

      handleBack(){
          this.setState({
              item:null
          })
      }

    render() {
        return(
            
            <View>
              {this.props.isAuthenticated ? (
            <View>
                <VendorLogout/>
                {
                    this.state.item?(
                    <View>
                    <Text onPress={this.handleBack}>Go Back</Text>
                    <Text> Item Details:</Text>
                    <Text> category: {this.state.item.cat_id.name}</Text> 
                    <Text> subcategory: {this.state.item.sub_cat_id.name}</Text>
                    <Text> quantity: {this.state.item.quantity}</Text>
                      {this.state.item.sub_cat_id.quantity_type}
                    
                    </View>
                ):(
                    <View>
                    <Text>Here are all the items you purchased</Text>
                    <View>
                    {
                        this.state.items? this.state.items.map(item=>{
                           return (<View key={item._id} onClick={()=>this.handleList(item)}>
                                    <Text>category:{item.cat_id.name}</Text>
                                    <Text> subcategory:{item.sub_cat_id.name}</Text>
                                    <Text>quantity:{item.quantity}{item.sub_cat_id.quantity_type}</Text>
                                  </View>)
                            }) : (<Text>No Items to display</Text>)
                        
                    }
                    </View>
                </View>
                )
                }
                <View>
                    <Text onPress={() => Actions.vendorNewsfeed()}>Purchase new Item</Text>
                </View>
                <View>
                    <Text onPress={() => Actions.vendorNewWasteType()}>Request for new category or sub-category</Text>
                </View>
            </View>
            
            ) : (
                <Text>Please Login First!</Text>
              )}
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
  )(ViewBuyedItem);