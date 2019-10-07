import React, { Component } from 'react';
import LOgin1 from '../Components/Login1.js';
import LOgin2 from '../Components/Login2.js';

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
    this.setState({user:'buyer'});
  }

 render () {
   return (
     <div>
       <input type='submit' value='Seller' onClick={this.handleChangeE}></input>
       <input type='submit' value='Buyer' onClick={this.handleChangeP}></input>
       {this.state.user==='buyer'?<LOgin1/>:<LOgin2/>}
     </div>
   )
 }
}
export default Login;
