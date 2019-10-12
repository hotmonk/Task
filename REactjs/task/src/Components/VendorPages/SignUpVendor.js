import React, {Component} from 'react';
import axios from 'axios';

class SignUpVendor extends Component {

    constructor(props) {
        super(props);

        this.onChangename = this.onChangename.bind(this);
        this.onChangeemail = this.onChangeemail.bind(this);
        this.onChangecontact = this.onChangecontact.bind(this);
        this.onChangeaddress = this.onChangeaddress.bind(this);
        this.onChangepassword = this.onChangepassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            name: '',
            email: '',
            contact: 0,
            address: '',
            password: ''
        }
    }

    onChangename(e) {
        this.setState({
            name: e.target.value
        });
    }

    onChangeemail(e) {
        this.setState({
            email: e.target.value
        });
    }

    onChangecontact(e) {
        this.setState({
            contact: e.target.value
        });
    }

    onChangeaddress(e) {
        this.setState({
            address: e.target.value
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
        console.log(`name ${this.state.name}`);
        console.log(`Email: ${this.state.email}`);
        console.log(`Contact: ${this.state.contact}`);
        console.log(`Address: ${this.state.address}`);

        const newVendor = {
            name: this.state.name,
            email: this.state.email,
            contact: this.state.contact,
            address: this.state.address,
            password: this.state.password
        }

        axios.post('http://localhost:4000/vendor/signUp', newVendor)
            .then(res => console.log("Signing Up Vendor"));

        this.setState({
            name: '',
            email: '',
            contact: '',
            address: '',
            password: '',
        })
    }

    render() {
        return (
            <div>
                <h3>Register Yourself as Vendor!</h3>
                <form onSubmit={this.onSubmit}>
                    <div>
                      <label>Name: </label>
                      <input  type="text"
                              value={this.state.name}
                              onChange={this.onChangename}
                              />
                    </div>
                    <div>
                      <label>Email: </label>
                      <input  type="email"
                              value={this.state.email}
                              onChange={this.onChangeemail}
                              />
                    </div>
                    <div>
                      <label>Contact </label>
                      <input  type="number"
                              value={this.state.contact}
                              onChange={this.onChangecontact}
                              />
                    </div>
                    <div>
                      <label>Address: </label>
                      <input  type="text"
                              value={this.state.address}
                              onChange={this.onChangeaddress}
                              />
                    </div>
                    <div>
                      <label>Password: </label>
                      <input  type="password"
                              value={this.state.password}
                              onChange={this.onChangepassword}
                              />
                    </div>

                    <input type="submit" value="Register Vendor" />
                </form>
            </div>
        )
    }
}

export default SignUpVendor;