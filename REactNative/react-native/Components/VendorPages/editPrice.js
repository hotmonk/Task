import React, {Component} from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View,TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import VendorLogout from './LogoutVendor';
import axios from 'axios';

class editPrice extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            items:[]
        }
        if(this.props.isAuthenticated){
            // Headers
            const config = {
                headers: {
                'Content-type': 'application/json'
                }
            };
            axios.get(process.env.REACT_APP_BASE_URL+'/vendor/selections/'+this.props.vendorData.selection_id,config)
                .then(res=>{
                    this.setState({
                        items:res.data
                    })
                })
                .catch(e=>{
                    console.log(e);
                })
        }
    }

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
        if(!this.props.isAuthenticated){
            this.props.history.push('/vendor/login');
        }
      }

      handlePriceChange(event,index){
          var items=this.state.items.map(item=>{
              return {...item}
          });
          items[index].price=event.target.value;
          this.setState({
              items:items
          })
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
            axios.put(process.env.REACT_APP_BASE_URL+'/vendor/selections/'+this.props.vendorData.selection_id,body,config)
              .then(res=>{
                  return axios.delete( process.env.REACT_APP_BASE_URL+'/vendor/selections/'+id,config);
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
          axios.put(process.env.REACT_APP_BASE_URL+'/vendor/selections/'+this.props.vendorData.selection_id,body,config)
            .then(res=>{
                this.props.history.push('/vendor/profile');
            })
            .catch(err=>{
                console.log(err);
            })
      }
  
    // static propTypes = {
    //     vendorData:PropTypes.isRequired,
    //     isAuthenticated: PropTypes.bool,
    //     error: PropTypes.object.isRequired,
    //     clearErrors: PropTypes.func.isRequired
    //   };

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
                                <Text>Price:<TextInput
                                onChange={(event)=>this.handlePriceChange(event,index)} 
                                value={selected.price}/>  {selected.subcat_id.quantity_type}</Text>
                                <Text onPress={(event)=>this.deleteHandler(event,selected._id)}>Delete</Text>
                              </View>
                            ))
                          }
                        </View>
                      ):(
                        <View>You have selected no prefered category</View>
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