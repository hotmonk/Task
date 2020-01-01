import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';
import { Text, FlatList, StyleSheet,View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import VendorLogout from './LogoutVendor';
import {baseURL} from '../../config/constants.js';

class NewsFeed extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items:null,
            item:null
        }
        this.handleBack=this.handleBack.bind(this);
        this.handlePurchase=this.handlePurchase.bind(this);
        if(this.props.isAuthenticated){
          // Headers
          const config = {
              headers: {
              'Content-type': 'application/json'
              }
          };
          axios.get(baseURL+'/vendor/newsfeed', config)
              .then(response=>{
                  this.setState({
                      items:response.data
                  });
              })
              .catch(error=>{
                  console.log(error);
              })
        }
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        clearErrors: PropTypes.func.isRequired
      };

      handlePurchase(){
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
                  this.props.history.push('vendorPayments')
              })
              .catch(error=>{
                  console.log(error);
              })
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

      componentDidUpdate()
    {
        if(!this.props.isAuthenticated){
            this.props.history.push('vendorLogin');
        }
    }

    render() {
        return(
            <View>
            {
                this.state.item?(
                <View>
                   <Text onPress={this.handleBack}>Go Back</Text>
                   <Text> Item Details:</Text>
                   <Text> category: {this.state.item.cat.name}</Text>
                   <Text> subcategory: {this.state.item.subcat.name}</Text>
                   <Text> quantity: {this.state.item.quantity}</Text>{this.state.item.subcat.quantity_type}

                </View>
            ):(
                <View>
                <Text>Here are all the items for sale</Text>
                <FlatList
                 data={this.state.items}
                 renderItem={({item}) => <Text>category:{item.key.cat_id.name} subcategory:{item.key.sub_cat_id.name}  quantity:{item.key.quantity}{item.key.sub_cat_id.quantity_type}</Text>}
                />
            </View>
            )
            }
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
  )(NewsFeed);
