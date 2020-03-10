import React, {Component} from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';
import { Text, FlatList, StyleSheet,View } from 'react-native';
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
            Actions.sellerLogin();
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
            axios.post(baseURL+'/seller/'+this.props.seller._id+'/getVendor',body, config)
                .then(response=>{
                    var body=response.data;
                    if(body.status&&body.status==='fail'){
                        this.setState({
                            msg:body.msg,
                            vendor:null
                        })
                    }else{
                        this.setState({
                            vendor:body,
                            msg:null
                        })
                    }
                })
                .catch(error=>{
                    console.log(error);
                })
        }
    }

    handleAccept(){
        const config = {
            headers: {
            'Content-type': 'application/json'
            }
        };
        const body=JSON.stringify({
            item_id:this.state.item._id
        })
        axios.post(baseURL+'/seller/'+this.props.seller._id+'/vendorAccept',body, config)
            .then(response=>{
                var body=response.data;
                this.setState({
                    msg:body.msg,
                    vendor:null
                })
            })
            .catch(error=>{
                console.log(error);
            })
    }

    handleReject(){
        const config = {
            headers: {
            'Content-type': 'application/json'
            }
        };
        const body=JSON.stringify({
            item_id:this.state.item._id
        })
        axios.post(baseURL+'/seller/'+this.props.seller._id+'/vendorReject',body, config)
            .then(response=>{
                var body=response.data;
                if(body.status&&body.status==='fail'){
                    this.setState({
                        msg:body.msg,
                        vendor:null
                    })
                }else{
                    this.setState({
                        vendor:body,
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
        return(
            <View>
                 {this.props.isAuthenticated ? (
            <View>
                <SellerLogout/>
            {
                this.state.item?(
                <View>
                   <Text onPress={this.handleBack}>Go Back</Text>
                   <Text> Item Details:</Text>
                   <Text> category: {this.state.item.cat_id.name}</Text>
                   <Text> subcategory: {this.state.item.sub_cat_id.name}</Text>
                   <Text> quantity: {this.state.item.quantity}</Text>{this.state.item.sub_cat_id.quantity_type}
                   {
                        this.state.vendor?(
                            <View>
                                <Text>Name :{this.state.vendor.name}</Text>
                                <Text>Quoted price :{this.state.vendor.price} {this.state.item.sub_cat_id.quantity_type}</Text>
                                <Text>Distance :{this.state.vendor.distance}</Text>
                                <Text onPress={this.handleAccept.bind(this)}>Accept</Text>
                                <Text onPress={this.handleReject.bind(this)}>Reject</Text>
                            </View>
                        ):(
                            <Text>{this.state.msg}</Text>
                        )
                    }
                </View>
            ):(
            <View>
                <Text>Here are all the items for sale</Text>
               {this.state.items? this.state.items.map(item=>{
                                return (<View key={item._id} onPress={()=>this.handleList(item)}>
                                    <Text>category:{item.cat_id.name}</Text>
                                    <Text> subcategory:{item.sub_cat_id.name}</Text>
                                    <Text>quantity:{item.quantity}{item.sub_cat_id.quantity_type} {"\n"}</Text>
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
