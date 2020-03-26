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
            base64Flag : 'data:image/png/jpeg/jpg;base64,',
            date:null,
            time:null,
            error:null
            //paymentInfo:null
        }
        this.handleBack=this.handleBack.bind(this);
        // this.handleDate=this.handleDate.bind(this);
        // this.handleTime=this.handleTime.bind(this);
        this.handleAcceptance=this.handleAcceptance.bind(this);
        this.handleRejection=this.handleRejection.bind(this);
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
    // handleDate(event){
    //     this.setState({
    //         date:event.target.value
    //         date: date
    //     });
    // }
    handleTime = (time) => {  
        this.setState({ time }) 
        console.log(this.state.time) 
      } 
    handleDate = (date) => {  
        this.setState({date}) 
        console.log(this.state.date) 
      } 




    // handleTime(event){
    //     this.setState({
    //         time:event.target.value
            
    //         this.setState({ time })
    //     });
    // }
    handleBack(){
        this.setState({
            item:null
        })
    }

    handleList(item){
        if(item.imageData){
            var binary = '';
            var bytes = [].slice.call(new Uint8Array(item.imageData.data));
            bytes.forEach((b) => binary += String.fromCharCode(b));
            item.imageData.data= window.btoa(binary);
        }
      this.setState({
          item
      });
  }

  handleAcceptance(item_id){

    console.log("startedsubmit")
    if(this.state.date===""||this.state.time===""||this.state.time===null||this.state.date===null){
        this.setState({
            error:"enter valid date as well as time"
        })
        return;
    }

    const config = {
        headers: {
        'Content-type': 'application/json'
        }
    };
    const body=JSON.stringify({
        item_id,
        date:this.state.date,
        time:this.state.time
    })

    console.log("submit")

    axios.post(baseURL+'/vendor/'+this.props.vendor._id+'/acceptOffer', body ,config)
        .then(response=>{
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

        console.log("submitted")
}


handleRejection(item_id){
    const config = {
        headers: {
        'Content-type': 'application/json'
        }
    };

    const body=JSON.stringify({
        item_id
    })

    axios.post(baseURL+'/vendor/'+this.props.vendor._id+'/rejectOffer', body ,config)
        .then(response=>{
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
                <Text/><Text/><Text/><Text/>
            {/* { this.state.paymentInfo? (
                   <View>
                    <Form 
                    ref={el=>{this.instance=el } } method='POST' 
                    action={this.state.paymentInfo.TXN_URL}>
                      </Form> 
                        {
                            //this.findFields()
                            Object.keys(this.state.paymentInfo).map(key=>{
                                return <Text name={key}>{this.state.paymentInfo[key]}</Text>
                            })
                        }
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
                ) : <View> */}
                {this.props.isAuthenticated ? (
            <View>
            {this.state.item?(
                 this.state.item.imageData ? (
                <View>
                   <Text onPress={this.handleBack}>Go Back</Text>
                   <Text> Item Details:</Text>
                   <Text> category: {this.state.item.cat_id.name}</Text>
                   <Text> subcategory: {this.state.item.sub_cat_id.name}</Text>
                   <Text> quantity: {this.state.item.quantity}
                   {this.state.item.sub_cat_id.quantity_type}</Text>
                   <Text>Date</Text>
                   <TextInput type="date" onChangeText={this.handleDate} />
                   <Text>Time</Text>
                    <TextInput type="time" onChangeText={this.handleTime} />
                    <Text>{console.log(this.state.item._doc._id)}</Text>
                    <Button title="Bid for it" onPress={()=>{this.handleAcceptance(this.state.item._doc._id)}}></Button>
                    <Button title="Reject it"onPress={()=>{this.handleRejection(this.state.item._doc._id)}}></Button>
                </View>
            ):(
                <View>
                <Text onPress={this.handleBack}>Go Back</Text>
                <Text> Item Details:</Text>
                <Text> category: {this.state.item.cat_id.name}</Text>
                <Text> subcategory: {this.state.item.sub_cat_id.name}</Text>
                <Text> quantity: {this.state.item.quantity}
                {this.state.item.sub_cat_id.quantity_type}</Text>
                <Text>Date</Text>
                <TextInput type="date" onChangeText={this.handleDate} />
                <Text>Time</Text>
                 <TextInput type="time" onChangeText={this.handleTime} />
                 <Text>{console.log(this.state.item)}</Text>
                 <Button title="Bid for it" onPress={()=>{this.handleAcceptance(this.state.item._id)}}></Button>
                 <Button title="Reject it" onPress={()=>{this.handleRejection(this.state.item._id)}}></Button>
             </View>
            )
            ):(
                <View>
                <Text>Here are all the items for sale</Text>
                  {
                      this.state.items? this.state.items.map(item=>{
                              return (<View key={item.id}>
                              <Text>category:{item.cat_id.name}</Text>
                              <Text> subcategory:{item.sub_cat_id.name}</Text>
                              <Text>quantity:{item.quantity}{item.sub_cat_id.quantity_type}{"\n"}</Text>
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
