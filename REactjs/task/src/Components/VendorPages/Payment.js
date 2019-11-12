import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';
import {Link} from 'react-router-dom';
import VendorLogout from './LogoutVendor';

class Payment extends Component{
    componentDidUpdate()
    {
        if(!this.props.isAuthenticated){
            this.props.history.push('/vendor/login');
        }
    }

    render(){
        return(
         <div>  
            <h1> Payment Successful! </h1>   
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