import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import SellerLogout from './LogoutSeller';

class sellerProfile extends Component {

    componentDidUpdate(prevProps) {
        if(!this.props.isLoading&&!this.props.isAuthenticated){
          this.props.history.push('/seller/login');
        }
        const { error } = this.props;
        if (error !== prevProps.error) {
          // Check for register error
          if (error.id === 'SELLER_REGISTER_FAIL' || error.id === 'SELLER_LOGIN_FAIL') {
            this.setState({ msg: error.msg.msg });
          } else {
            this.setState({ msg: null });
          }
        }
      }
       
      render(){
          return (
            <div>
              {this.props.isAuthenticated ? (
                <div>
                  <SellerLogout />
                  <div>
                      <h1>Welcome {this.props.sellerData.name}</h1>
                      <p>Here are all your Details..</p>
                      <h3>Name: {this.props.sellerData.name}</h3>
                      <h3>Email: {this.props.sellerData.email}</h3>
                      <h3>Contact: {this.props.sellerData.contact}</h3>
                      <h3>Address: {this.props.sellerData.address}</h3>
                      <button>Edit Details</button>
                  </div>
                  <div>
                    <Link to={"/seller/newItem"}>Add Items For Sale</Link>
                  </div>
                  <div>
                    <Link to={"/seller/items"}>View All items added by you</Link>
                  </div>
                  <div>
                    <Link to={"/seller/soldItems"}>View All the sold items by you</Link>
                  </div>
                </div>
              ) : (
                <h4>Please Login First!</h4>
              )}
            </div>
          );
      }
}

const mapStateToProps = state => ({
  isLoading:state.sellerAuth.isLoading,
    sellerData:state.sellerAuth.seller,
    isAuthenticated: state.sellerAuth.isAuthenticated,
    error: state.error
  });

export default connect(mapStateToProps,null)(sellerProfile);
  
