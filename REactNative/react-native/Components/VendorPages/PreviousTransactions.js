import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';
import { StyleSheet, Text, View,TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import VendorLogout from './LogoutVendor';

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
            axios.get(process.env.REACT_APP_BASE_URL+'/vendor/'+this.props.vendor._id+'/viewBuyedItem', config)
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
                    <Text> {this.state.item.sub_cat_id.quantity_type}</Text>
                    
                    </View>
                ):(
                    <View>
                    <Text>Here are all the items for sale</Text>
                    <View>
                    {
                        this.state.items? this.state.items.map(item=>{
                                return (<Text key={item._id} onPress={()=>this.handleList(item)}>
                                    category:{item.cat_id.name}  subcategory:{item.sub_cat_id.name}  quantity:{item.quantity}{item.sub_cat_id.quantity_type}
                                </Text>)
                            }) : (<Text>No Items to display</Text>)
                        
                    }
                    </View>
                </View>
                )
                }
                <View>
                    <Text onPress={() => Actions.newItem()}>Add new Item</Text>
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
  )(ViewSelledItem);