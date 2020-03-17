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
            paymentInfo:null,
            msg:null,
            quantity_taken:null,
            reason:true,
            reasonDesc:null,
        }
        this.handleBack=this.handleBack.bind(this);
        this.handlePurchase=this.handlePurchase.bind(this);
        this.handlePaymentMethod=this.handlePaymentMethod.bind(this);
        this.handleQuantityTaken=this.handleQuantityTaken.bind(this);
        this.handleQuantityTakenSubmit=this.handleQuantityTakenSubmit.bind(this);
        this.handleReason=this.handleReason.bind(this);
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
            item:null,
            msg:null
        })
    }

    handleList(item){
      this.setState({
          item,
          msg:null
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
                    paymentInfo:response.data,
                    msg:null
                })
            })
            .catch(err=>{
                console.log(err);
            })
    }

    handlePaymentMethod(method){
        const config = {
            headers: {
            'Content-type': 'application/json'
            }
        };
        const body=JSON.stringify({
            item_id:this.state.item._id,
            method
        })
        axios.post(baseURL+'/vendor/'+this.props.vendor._id+'/paymentMethod',body,config)
            .then(response=>{
                this.setState({
                    msg:response.data.msg
                })
                axios.get(baseURL+'/vendor/'+this.props.vendor._id+'/viewBuyedItem', config)
                    .then(response=>{
                        this.setState({
                            items:response.data,
                            item:null
                        })
                        return;
                    })
                    .catch(error=>{
                        console.log(error);
                    })
            })
            .catch(err=>{
                console.log(err);
            })
    }

    handleQuantityTaken(e){
        this.setState({
            quantity_taken:e.target.value
        })
        if(this.state.item.quantity!==parseInt(e.target.value,10)){
            this.setState({
                reason:true
            })
        }else{
            this.setState({
                reason:false
            })
        }
    }

    handleQuantityTakenSubmit(){
        var quantity_taken=parseInt(this.state.quantity_taken,10);
        if(quantity_taken===null){
            return;
        }
        if(quantity_taken>this.state.item.quantity){
            return;
        }
        if(quantity_taken!==this.state.item.quantity&&(this.state.reasonDesc===null||this.state.reasonDesc==='')){
            return;
        }
        const config = {
            headers: {
            'Content-type': 'application/json'
            }
        };
        var body;
        if(this.state.reason){
            body=JSON.stringify({
                quantity_taken:quantity_taken,
                reason:this.state.reasonDesc,
                item_id:this.state.item._id
            })
        }else{
            body=JSON.stringify({
                quantity_taken:quantity_taken,
                item_id:this.state.item._id
            })
        }
        axios.post(baseURL+'/vendor/'+this.props.vendor._id+'/quantityTaken',body,config)
            .then(response=>{
                this.setState({
                    item:response.data
                })
            })
            .catch(err=>{
                console.log(err);
            })
    }

    handleReason(e){
        this.setState({
            reasonDesc:e.target.value
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.msg?(<div><p>{this.state.msg}</p></div>):null
                }
                { this.state.paymentInfo? (
                    <div>
                    <form ref={el=>{this.instance=el } } method='POST' action={this.state.paymentInfo.TXN_URL}>
                        {
                            //this.findFields()
                            Object.keys(this.state.paymentInfo).map(key=>{
                                return <input type='hidden' name={key} value={this.state.paymentInfo[key]} />
                            })
                        }
                    </form>
                    <div><h1>Do not refresh. redirecting you to payment page</h1></div>
                    </div>
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
                                    this.state.item.transaction_id.status ?(<div>
                                                <h1>the seller rejected the offer</h1>
                                                <h2>Reason :</h2>
                                                <p>{this.state.item.transaction_id.reason}</p>
                                            </div>
                                        ):this.state.item.status==='PAYMENT'? !this.state.item.transaction_id.quantity_taken?(
                                        <div>
                                            <input type='text' onChange={this.handleQuantityTaken} placeholder='quantity taken from seller' />
                                            <br/>
                                            {
                                                this.state.reason?(<textarea onChange={this.handleReason} rows='25' cols='10' placeholder="If not taking full quantity, state the proper reason" >{this.state.reasonDesc}</textarea>):null
                                            }
                                            <button onClick={this.handleQuantityTakenSubmit}>Submit</button>
                                        </div>
                                    ): !this.state.item.transaction_id.method?(
                                        <div>
                                            <h5>Choose a payment Method</h5>
                                            <button onClick={()=>{this.handlePaymentMethod('COD')}}>Cash On Delivery</button>
                                            <button onClick={()=>{this.handlePaymentMethod('ONLINE')}}>Online Methods</button>
                                        </div>
                                    ): this.state.item.transaction_id.method==='ONLINE'?(
                                        <div>
                                            <button onClick={this.handlePurchase}>Make Online Payment</button>
                                        </div>
                                    ):(
                                        <div>Cash On Delivery Payment Method Selected</div>
                                    )
                                    :(
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