import React, {Component} from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';
import {Link} from 'react-router-dom';
import {baseURL} from '../../../config/constants.js';

class Payment extends Component{
    constructor(props)
    {
        super(props);
        this.state={
            item:null,
            price:0
        }
        const config = {
            headers: {
            'Content-type': 'application/json'
            }
        };
        axios.get(baseURL+'/vendor/viewItem/'+this.props.match.params.itemId,config)
            .then(response=>{
                this.setState({
                    item:response.data
                });
            })
            .catch(err=>{
                console.log(err);
            })
    }

    componentDidUpdate()
    {
        if(!this.props.isAuthenticated){
            this.props.history.push('/vendor/login');
        }
    }

    purchase()
    {
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
                this.props.history.push('/vendor/viewBuyedItems');
            })
            .catch(error=>{
                console.log(error);
            })
    }
    
    render(){
        return(
         <div>  
             {console.log(this.state.item)}
            <h1> Category name: </h1>  <h2>{this.state.item.cat_id.name}</h2>
            <h1> Sub-Category name: </h1>  <h2>{this.state.item.sub_cat_id.name}</h2>
            <h1> quantity: </h1>   <h2>{this.state.item.quantity}</h2>
            <h1> Amount to be paid: </h1>  <h2>{this.state.item.quantity*10}</h2>
            <button onClick={this.Purchase}>Make Payment</button>
            <div>
                <Link to='/vendor/viewBuyedItems'>View all purchased items</Link>
            </div>
            <div>
                <Link to='/vendor/profile'>Profile</Link>
            </div>
         </div> 
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
  )(Payment);