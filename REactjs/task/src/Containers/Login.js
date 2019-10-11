import React, { Component } from 'react';
import LoginVendor from '../Components/LoginVendor.js';
import LoginSeller from '../Components/LoginSeller.js';

class Login extends Component {
constructor (props) {
  super(props);
  this.state = {
    user:'seller'
  };
  this.handleChangeE = this.handleChangeE.bind(this);
  this.handleChangeP = this.handleChangeP.bind(this);
}

  handleChangeE(event) {
    this.setState({user:'seller'});
  }
 handleChangeP(event) {
    this.setState({user:'vendor'});
  }

 render () {
   return (
     <div>
       <input type='submit' value='Seller' onClick={this.handleChangeE}></input>
       <input type='submit' value='Vendor' onClick={this.handleChangeP}></input>
       {this.state.user==='vendor'?<LoginVendor/>:<LoginSeller/>}
     </div>
   )
 }
}
export default Login;
