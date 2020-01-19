import React, {Component} from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';
import { Link } from 'react-router-dom';
import VendorLogout from './LogoutVendor';
import {baseURL} from '../../../config/constants.js';

class ViewBuyedItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            items:null,
            item:null,
            paymentInfo:null
        }
        this.handleBack=this.handleBack.bind(this);
        this.handlePurchase=this.handlePurchase.bind(this);
    }

    componentDidMount(){
        setTimeout(()=>{
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
        },500);
    }

    componentDidUpdate(){
        if(!this.props.isLoading&&!this.props.isAuthenticated){
            this.props.history.push('/vendor/login');
        }
        if(this.state.paymentInfo){
            console.log(this.instance);
            this.instance.submit();
        }
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
        const config = {
            headers: {
            'Content-type': 'application/json'
            }
        };
        const body=JSON.stringify({
            vendor_id:this.props.vendor._id,
            item_id:this.state.item._id
        })
        axios.post(baseURL+'/payment/',body,config)
            .then(response=>{
                this.setState({
                    paymentInfo:response.data
                })
            })
            .catch(err=>{
                console.log(err);
            })
    }

    render() {
        return (
            <div>
                { this.state.paymentInfo? (
                    <form ref={el=>{this.instance=el } } method='POST' action={this.state.paymentInfo.TXN_URL}>
                        {
                            //this.findFields()
                            Object.keys(this.state.paymentInfo).map(key=>{
                                return <input type='hidden' name={key} value={this.state.paymentInfo[key]} />
                            })
                        }
                    </form>

                ) : <div>
                {this.props.isAuthenticated ? (
                    <div>
                        <VendorLogout/>
                        {
                            this.state.item?(
                            <div>
                                <button onClick={this.handleBack}>Go Back</button>
                                <h1> Item Details:</h1>
                                <h2> category: {this.state.item.cat_id.name}</h2> 
                                <h2> subcategory: {this.state.item.sub_cat_id.name}</h2>
                                <h2> quantity: {this.state.item.quantity}</h2>{this.state.item.sub_cat_id.quantity_type}
                                {
                                    this.state.item.status==='PAYMENT'?(
                                        <div>
                                            <button onClick={this.handlePurchase}>Purchase it</button>
                                        </div>
                                    ):(
                                        <h3>Item Purchased</h3>
                                    )
                                }
                            </div>
                            ):(
                                <div>
                                    <h1>Here are all the items you purchased</h1>
                                    <ul>
                                    {
                                        this.state.items? this.state.items.map(item=>{
                                            return (<li key={item._id} onClick={()=>this.handleList(item)}>
                                                <div>category:{item.cat_id.name}</div><div> subcategory:{item.sub_cat_id.name}</div>
                                                <div>quantity:{item.quantity}{item.sub_cat_id.quantity_type}</div>
                                            </li>)
                                        }) : (<h1>No Items to display</h1>)
                                        
                                    }
                                    </ul>
                                </div>
                            )
                        }
                        <div>
                            <Link to="./newsfeed">Purchase new Item</Link>
                        </div>
                        <div>
                                <Link to='/vendor/newWasteType'>Request for new category or sub-category</Link>
                        </div>
                    </div>
                ) : (
                  <h4>Please Login First!</h4>
                )}
              </div>}
            </div>
        )
    }
}



const mapStateToProps = state => ({
    isLoading:state.vendorAuth.isLoading,
    token:state.vendorAuth.token,
    vendor:state.vendorAuth.vendor,
    isAuthenticated: state.vendorAuth.isAuthenticated,
    error: state.error
  });
  
  export default connect(
    mapStateToProps,
    { clearErrors }
  )(ViewBuyedItem);