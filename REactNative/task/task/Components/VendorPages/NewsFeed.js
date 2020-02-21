import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';
import { Text, FlatList, StyleSheet,View, Button,Form,TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import VendorLogout from './LogoutVendor';
import {baseURL} from '../../config/constants.js';

class NewsFeed extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items:null,
            item:null,
            //paymentInfo:null
        }
        this.handleBack=this.handleBack.bind(this);
        this.handlePurchase=this.handlePurchase.bind(this);
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        clearErrors: PropTypes.func.isRequired
      };

      componentDidMount(){
        setTimeout(()=>{
            if(this.props.isAuthenticated){
            // Headers
            const config = {
                headers: {
                'Content-type': 'application/json'
                }
            };
            axios.get(baseURL+'/vendor/newsfeed/'+this.props.vendor._id, config)
                .then(response=>{
                    this.setState({
                        items:response.data
                    });
                })
                .catch(error=>{
                    console.log(error);
                })
          }
        },500);
      }
    
    componentDidUpdate()
    {
        if(!this.props.isLoading&&!this.props.isAuthenticated){
            Actions.vendorLogin();
        }
        // if(this.state.paymentInfo){
        //     console.log(this.instance);
        //     this.instance.submit();
        // }
    }

    handleBack(){
        this.setState({
            item:null
        })
    }

    handleList(item){
      this.setState({
          item
      });
  }
    
    handlePurchase(){

        // const config = {
        //     headers: {
        //     'Content-type': 'application/json'
        //     }
        // };
        // const body=JSON.stringify({
        //     vendor_id:this.props.vendor._id,
        //     item_id:this.state.item.id
        // })
        // axios.post(baseURL+'/payment/',body,config)
        //     .then(response=>{
        //         this.setState({
        //             paymentInfo:response.data
        //         })
        //     })
        //     .catch(err=>{
        //         console.log(err);
        //     })
    const config = {
          headers: {
          'Content-type': 'application/json'
          }
      };

      const body=JSON.stringify({
          item_id:this.state.item.id
      })
      axios.post(baseURL+'/vendor/'+this.props.vendor._id+'/transaction', body ,config)
          .then(response=>{
              console.log(response.data);
            const config = {
                headers: {
                'Content-type': 'application/json'
                }
            };
            axios.get(baseURL+'/vendor/newsfeed/'+this.props.vendor._id, config)
                .then(response=>{
                    this.setState({
                        items:response.data,
                        item:null
                    });
                })
                .catch(error=>{
                    console.log(error);
                })
          })
          .catch(error=>{
              console.log(error);
          })
    }

    render() {
        return(
            <View>
            { this.state.paymentInfo? (
                   <View>
                    {/* <Form 
                    ref={el=>{this.instance=el } } method='POST' 
                    action={this.state.paymentInfo.TXN_URL}>
                      </Form> 
                        {
                            //this.findFields()
                            Object.keys(this.state.paymentInfo).map(key=>{
                                return <Text name={key}>{this.state.paymentInfo[key]}</Text>
                            })
                        } */}
                      {
                        Object.keys(this.state.paymentInfo).map(key=>{
                            return(
                           <View>
                                <Text name={key}>{this.state.paymentInfo[key]}</Text>
                            </View>
                            )
                            })
                      }
                    <Text onPress={()=>this.handleclick(this.state.paymentInfo)}>click</Text>
                   </View>
                ) : <View>
                {this.props.isAuthenticated ? (
            <View>
            {
                this.state.item?(
                <View>
                   <Text onPress={this.handleBack}>Go Back</Text>
                   <Text> Item Details:</Text>
                   <Text> category: {this.state.item.cat.name}</Text>
                   <Text> subcategory: {this.state.item.subcat.name}</Text>
                   <Text> quantity: {this.state.item.quantity}
                   {this.state.item.subcat.quantity_type}</Text>
                  <Text onPress={this.handlePurchase}>Purchase it</Text>
                </View>
            ):(
                <View>
                <Text>Here are all the items for sale</Text>
                  {
                      this.state.items? this.state.items.map(item=>{
                              return (<View key={item.id}>
                              <Text>category:{item.cat.name}</Text>
                              <Text> subcategory:{item.subcat.name}</Text>
                              <Text>quantity:{item.quantity}{item.subcat.quantity_type}{"\n"}</Text>
                              <Text  onPress={()=>this.handleList(item)}>Click</Text>
                              </View>)
                          }) : (<Text>No Items to display</Text>)
                      
                  }
            </View>
            )
            }
            </View>
            ) : (
                <Text>Please Login First!</Text>
              )}
            </View>}
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
