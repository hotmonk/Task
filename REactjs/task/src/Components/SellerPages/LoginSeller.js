import React, {Component} from 'react';
import axios from 'axios';

class LoginSeller extends Component {

    constructor(props) {
        super(props);

        this.onChangeemail = this.onChangeemail.bind(this);
        this.onChangepassword = this.onChangepassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            email: '',
            password: ''
        }
    }

    onChangeemail(e) {
        this.setState({
            email: e.target.value
        });
    }

    onChangepassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        console.log(`Form submitted:`);
        console.log(`Email: ${this.state.email}`);

        const loginSeller = {
            email: this.state.email,
            password: this.state.password
        }

        axios.post('http://localhost:4000/seller/login', loginSeller)
            .then(res => console.log("Seller Logging In"));

        this.setState({
            email: '',
            password: ''
        });
    }

    render() {
        return (
            <div>
                <h3>Login as Seller!</h3>
                <form onSubmit={this.onSubmit}>
                    <div>
                      <label>Email: </label>
                      <input  type="email"
                              value={this.state.email}
                              onChange={this.onChangeemail}
                              />
                    </div>
                    <div>
                      <label>Password: </label>
                      <input  type="password"
                              value={this.state.password}
                              onChange={this.onChangepassword}
                              />
                    </div>

                    <input type="submit" value="Login Seller" />
                </form>
            </div>
        )
    }
}
  
export default LoginSeller;
