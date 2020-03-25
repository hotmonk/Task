import React, {Component} from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';
import {baseURL} from '../../../config/constants.js';
import Navbar from './Navbar';

class ViewItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items:null,
            item:null,
            vendors:null,
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

    render() {
        return(
            
            <div>
              {this.props.isAuthenticated ? (
            <div>
                <Navbar />
                {
                    this.state.item?(
                    <div>
                    <button onClick={this.handleBack}>Go Back</button>
                    <h1> Item Details:</h1>
                    <h2> category: {this.state.item.cat_id.name}</h2> 
                    <h2> subcategory: {this.state.item.sub_cat_id.name}</h2>
                    <h2> quantity: {this.state.item.quantity}</h2>{this.state.item.sub_cat_id.quantity_type}
                    {
                        this.state.vendors?(
                            <div>
                                {
                                    this.state.vendors.map(vendor=>{
                                        return (
                                            <div key={vendor.quote_id}>
                                                <p><strong>Name : </strong>{vendor.name}</p>
                                                <p><strong>Quoted price : </strong>{vendor.price} {this.state.item.sub_cat_id.quantity_type}</p>
                                                <p><small><strong>Distance : </strong>{vendor.distance}</small></p>
                                                <p><strong>Approximate date of arrival: </strong>{vendor.date}</p>
                                                <p><strong>Approximate time of arrival: </strong>{vendor.time}</p>
                                                <button onClick={()=>{this.handleAccept(vendor.quote_id)}}>Accept</button>
                                                <button onClick={()=>{this.handleReject(vendor.quote_id)}}>Reject</button>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        ):(
                            <h3>{this.state.msg}</h3>
                        )
                    }
                    </div>
                ):(
                    <div>
                    <h1>Here are all the items added by you for sale</h1>
                    <ul>
                    {
                        this.state.items&&this.state.items.length? this.state.items.map(item=>{
                                return (<li key={item._id} onClick={()=>this.handleList(item)}>
                                    <div>category:{item.cat_id.name}</div><div> subcategory:{item.sub_cat_id.name}</div>
                                    <div>quantity:{item.quantity}{item.sub_cat_id.quantity_type}</div>
                                </li>)
                            }) : (<h1>No Items yet added</h1>)
                    }
                    </ul>
                </div>
                )
                }
            </div>
            ) : (
                <h4>Please Login First!</h4>
              )}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isLoading:state.sellerAuth.isLoading,
    token:state.sellerAuth.token,
    seller:state.sellerAuth.seller,
    isAuthenticated: state.sellerAuth.isAuthenticated,
    error: state.error
  });
  
  export default connect(
    mapStateToProps,
    { clearErrors }
  )(ViewItem);