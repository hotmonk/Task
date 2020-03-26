import React, {Component} from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';
import { Text, FlatList, StyleSheet,View, Button } from 'react-native';
import SellerLogout from './LogoutSeller';
import {baseURL} from '../../config/constants.js';
import { Actions } from 'react-native-router-flux';

class ViewItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items:null,
            item:null,
            vendor:null,
            msg:null
        }
        this.handleBack=this.handleBack.bind(this);
        this.handleAccept=this.handleAccept.bind(this);
        this.handleReject=this.handleReject.bind(this);
    }

    componentDidMount(){
        setTimeout(()=>{
            // Headers
            const config = {
                headers: {
                'Content-type': 'application/json'
                }
            };
            axios.get(baseURL+'/seller/'+this.props.seller._id+'/viewItem', config)
                .then(response=>{
                    console.log(response);
                    this.setState({
                        items:response.data
                    })
                })
                .catch(error=>{
                    console.log(error);
                })
        },500)
    }

    componentDidUpdate(prevProps,prevState)
    {
        if(!this.props.isLoading&&!this.props.isAuthenticated){
            this.props.history.push('/seller/login');
        }
        if(prevState.item!==this.state.item&&this.state.item!==null){
            const config = {
                headers: {
                'Content-type': 'application/json'
                }
            };
            const body=JSON.stringify({
                item_id:this.state.item._id
            })
            axios.post(baseURL+'/seller/'+this.props.seller._id+'/getVendors',body, config)
                .then(response=>{
                    var body=response.data;
                    if(body.status&&body.status==='fail'){
                        this.setState({
                            msg:body.msg,
                            vendor:null
                        })
                    }else{
                        this.setState({
                            vendors:body,
                            msg:null
                        })
                    }
                })
                .catch(error=>{
                    console.log(error);
                })
        }
    }

    handleAccept(quote_id){
        console.log('hrer');
        const config = {
            headers: {
            'Content-type': 'application/json'
            }
        };
        const body=JSON.stringify({
            item_id:this.state.item._id,
            quote_id
        })
        axios.post(baseURL+'/seller/'+this.props.seller._id+'/vendorAccept',body, config)
            .then(response=>{
                axios.get(baseURL+'/seller/'+this.props.seller._id+'/viewItem', config)
                    .then(response2=>{
                        this.setState({
                            items:response2.data,
                            item:null,
                            vendor:null
                        })
                    })
                    .catch(error=>{
                        console.log(error);
                    })
            })
            .catch(error=>{
                console.log(error);
            })
    }

    handleReject(quote_id){
        const config = {
            headers: {
            'Content-type': 'application/json'
            }
        };
        const body=JSON.stringify({
            item_id:this.state.item._id,
            quote_id
        })
        axios.post(baseURL+'/seller/'+this.props.seller._id+'/vendorReject',body, config)
            .then(response=>{
                var body=response.data;
                if(body.status&&body.status==='fail'){
                    this.setState({
                        msg:body.msg,
                        vendors:null
                    })
                }else{
                    this.setState({
                        vendors:body,
                        msg:null
                    })
                }
            })
            .catch(error=>{
                console.log(error);
            })
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

    render() {
        // {console.log(this.state.msg)}
        return(
            <View>
                 {this.props.isAuthenticated ? (
            <View>
                <SellerLogout/>
            {
                this.state.item?(
                <View>
                     <Text/><Text/><Text/><Text/>
                   <Text onPress={this.handleBack}>Go Back</Text>
                   <Text> Item Details:</Text>
                   <Text> category: {this.state.item.cat_id.name}</Text>
                   <Text> subcategory: {this.state.item.sub_cat_id.name}</Text>
                   <Text> quantity: {this.state.item.quantity} {this.state.item.sub_cat_id.quantity_type}</Text>
                   {
                        this.state.vendors?(
                            <View>
                            <View>
                                <Text>hello?</Text>
                            </View>
                            {
            
                                this.state.vendors.map(vendor=>{
                                    return(
                                    <View key={vendor.quote_id}>
                                        {console.log(vendor.name)}
                                    <Text>vendor</Text>
                                    <Text>Name :{vendor.name}</Text>
                                    <Text>Quoted price :{vendor.price} {this.state.item.sub_cat_id.quantity_type}</Text>
                                    <Text>Distance :{vendor.distance}</Text>
                                    <Text>Date of arrival :{vendor.date}</Text>
                                    <Text>Time of arrival :{vendor.time}</Text>
                                    <Text onPress={()=>{this.handleAccept(vendor.quote_id)}}>Accept</Text>
                                    <Text onPress={()=>{this.handleReject(vendor.quote_id)}}>Reject</Text>
                                    </View>
                                    )
                                })
                            }
                            </View>

                        ):(
                            <Text>msg:{this.state.msg}</Text>
                        )
                    }
                </View>
            ):(
            <View>
                
                 <Text/><Text/><Text/><Text/>
                <Text>Here are all the items for sale</Text>
               {this.state.items? this.state.items.map(item=>{
                                return (<View key={item._id} >
                                    <Text>category:{item.cat_id.name}</Text>
                                    <Text> subcategory:{item.sub_cat_id.name}</Text>
                                    <Text>quantity:{item.quantity}{item.sub_cat_id.quantity_type} {"\n"}</Text>
                                    <Button title="details" onPress={()=>{this.handleList(item)}}/>
                                </View>)
                            }) : (<Text>No Items to display</Text>)}
            </View>
            )
            }
            </View>): (
                <Text>Please Login First!</Text>
              )}
            </View>
        )
    }
}

const mapStateToProps = state => ({
    token:state.sellerAuth.token,
    seller:state.sellerAuth.seller,
    isAuthenticated: state.sellerAuth.isAuthenticated,
    error: state.error
  });

  export default connect(
    mapStateToProps,
    { clearErrors }
  )(ViewItem);
