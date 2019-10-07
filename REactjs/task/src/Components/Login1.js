import React, { Component } from 'react';
import {Link} from 'react-router-dom';
class Login extends Component {

constructor (props) {
  super(props);
  this.state = {
    email: '',
    password: '',
    validate: 'true'
  };
  this.handleChangeE = this.handleChangeE.bind(this);
  this.handleChangeP = this.handleChangeP.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
}

  handleChangeE(event) {
    this.setState({email: event.target.value});
  }
 handleChangeP(event) {
    this.setState({password: event.target.value});
  }

  handleSubmit(event) {
    alert('wrong email id or password');
    this.setState({password:''});
    this.setState({email:''});
    event.preventDefault();
  }

 render () {
   return (
     <div>
       <h2>Sign Up Buyer</h2>
         <Link to='/signUp1'>SignUp</Link>
       <h2>Sign In Buyer</h2>
       <div>
         <label >Email address</label>
         <input type='email'
         placeholder="email"
         value={this.state.email}
         onChange={this.handleChangeE}/>
       </div>
       <div>
         <label htmlFor='password'>Password</label>
         <input type='password'
           placeholder='password'
           value={this.state.password}
           onChange={this.handleChangeP} />
       </div>
       {this.state.validate==='false'?
        <input type='submit'
          value="submit"
          onClick={this.handleSubmit}>
          </input>:
          <Link to='/Options'>LogIn</Link>
        }

     </div>
   )
 }
}
export default Login;
