import React, {Component} from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View,TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import VendorLogout from './LogoutVendor';
import axios from 'axios';
import {baseURL} from '../../config/constants.js';

class editPrice extends Component {
  constructor(props)
  {
      super(props);
      this.state={
          price:0,
          items:[]
      }
  }

  componentDidMount(){
      setTimeout(()=>{
          const config = {
              headers: {
              'Content-type': 'application/json'
              }
          };
          axios.get(baseURL+'/vendor/selections/'+this.props.vendorData.selection_id,config)
              .then(res=>{
                  this.setState({
                      items:res.data,
                  })
              })
              .catch(e=>{
                  console.log(e);
              })
      },500);
  }

  componentDidUpdate(prevProps) {
      if(!this.props.isLoading&&!this.props.isAuthenticated){
        Actions.vendorProfile()
      }
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

    deleteHandler(event,id){
      event.preventDefault();
      if(this.props.isAuthenticated){

          var body=JSON.stringify({
              ...this.state
          })
            // Headers
            const config = {
                headers: {
                'Content-type': 'application/json'
                }
            };
          axios.put(baseURL+'/vendor/selections/'+this.props.vendorData.selection_id,body,config)
            .then(res=>{
                return axios.delete( baseURL+'/vendor/selections/'+id,config);
            })
            .then(res => {
                this.setState({
                  items:res.data
                })
            })
            .catch(err=>{
              console.log("category add request failed.retry later",err)
            })
      }
    }

    
    handlePriceChange(event,index){
      var items=this.state.items.map(item=>{
          return {...item}
      });
      items[index].price=this.state.price;
      this.setState({
          items:items
      })
  }

    submitForm(event)
    {
        event.preventDefault();

        var body=JSON.stringify({
            ...this.state
        })
          // Headers
          const config = {
              headers: {
              'Content-type': 'application/json'
              }
          };
        axios.put(baseURL+'/vendor/selections/'+this.props.vendorData.selection_id,body,config)
          .then(res=>{
              Actions.vendorProfile()
          })
          .catch(err=>{
              console.log(err);
          })
    }

  // static propTypes = {
  //     vendorData:PropTypes.isRequired,
  //     isAuthenticated: PropTypes.bool,


      render(){
          return (
            <View>
              {this.props.isAuthenticated ? (
            <View>
              <VendorLogout/>
              <View>
                    {
                      this.state.items&&this.state.items.length ?(
                        <View>
                          {
                            this.state.items.map((selected,index)=>(
                              <View key={selected._id}>
                                <Text>Category:{selected.subcat_id.cat_id.name}</Text>
                                <Text>Sub-category:{selected.subcat_id.name}</Text>
                                <Text>Price:{selected.price} {selected.subcat_id.quantity_type}</Text>
                                <Text>Enter New Price:</Text>
                                <TextInput 
                                onChangeText={(price) => this.setState({ price })}
                                >{selected.price}</TextInput>
                                <Text onPress={(event)=>this.handlePriceChange(event,index)} >Change</Text>
                                <Text onPress={(event)=>this.deleteHandler(event,selected._id)}>Delete</Text>
                              </View>
                            ))
                          }
                        </View>
                      ):(
                        <Text>You have selected no prefered category</Text>
                      )
                    }
                </View>
                <Text onPress={(event)=>this.submitForm(event)}>save changes</Text>
                <Text onPress={() => Actions.vendorProfile()}>Go to profile page!</Text>
            </View>
            ) : (
                <Text>Please Login First!</Text>
              )}
            </View>
          );
      }
}

const mapStateToProps = state => ({
    token:state.vendorAuth.token,
    vendorData:state.vendorAuth.vendor,
    isAuthenticated: state.vendorAuth.isAuthenticated,
    error: state.error
  });

export default connect(mapStateToProps,null)(editPrice);