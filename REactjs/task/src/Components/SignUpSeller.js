import React, {Component} from 'react';
import axios from 'axios';

export default class SignUpSeller extends Component {

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

        const newSeller = {
            name: this.state.name,
            email: this.state.email,
            contact: this.state.contact,
            address: this.state.address,
            password: this.state.password
        }

        axios.post('http://localhost:4000/SignUpSeller', newSeller)
            .then(res => console.log("hii"));

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
                <h3>Register Yourself as Seller!</h3>
                <form onSubmit={this.onSubmit}>
                      <label>Name: </label>
                      <input  type="text"
                              value={this.state.name}
                              onChange={this.onChangename}
                              />
                      <label>Email: </label>
                      <input  type="email"
                              value={this.state.email}
                              onChange={this.onChangeemail}
                              />
                      <label>Contact </label>
                      <input  type="number"
                              value={this.state.contact}
                              onChange={this.onChangecontact}
                              />
                      <label>Address: </label>
                      <input  type="text"
                              value={this.state.address}
                              onChange={this.onChangeaddress}
                              />
                      <label>Password: </label>
                      <input  type="password"
                              value={this.state.password}
                              onChange={this.onChangepassword}
                              />

                      <input type="submit" value="Register Seller" />
                </form>
            </div>
        )
    }
}