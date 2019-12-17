import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { signupVendor } from '../../actions/vendorAuthActions';
import { clearErrors } from '../../actions/errorActions';
import {Redirect, Link} from 'react-router-dom';
import FetchLocation from '../commonComponents/FetchLocation';

class SignUpVendor extends Component {

    constructor(props) {
        super(props);

        this.onChangename = this.onChangename.bind(this);
        this.onChangeemail = this.onChangeemail.bind(this);
        this.onChangecontact = this.onChangecontact.bind(this);
        this.onChangeaddress = this.onChangeaddress.bind(this);
        this.onChangepassword = this.onChangepassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.redirectit = this.redirectit.bind(this);

        this.state = {
            name: '',
            email: '',
            contact: '',
            address: '',
            password: '',
            msg: null,
            latitude:null,
            longitude:null,
            locationEnabled:false
        }
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        signupVendor: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
      };

      componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
          // Check for register error
          if (error.id === 'VENDOR_REGISTER_FAIL') {
            this.setState({ msg: error.msg.msg });
          } else {
            this.setState({ msg: null });
          }
        }
      }

      redirectit=()=>{
        if(this.props.isAuthenticated)
        {
            return (
                <Redirect to='./profile' />
            )
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

        const { name, email, contact, address, password,latitude,longitude } = this.state;

        // Create user object
        const newVendor = {
        name,
        email,
        contact,
        address,
        password,
        latitude,
        longitude
        };

        this.props.signupVendor(newVendor);
    }

    setCoord(long,lat){
        this.setState({
            longitude:long,
            latitude:lat
        });
    }

    render() {
        return (
            <div>
                {this.redirectit()}
                <h3>Register Yourself as Vendor!</h3>
                {this.state.msg ? (
                console.log(this.state.msg)
                ) : null}
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
                    <FetchLocation setCoords={(long,lat)=>{this.setCoord(long,lat)}} />
                    <input type="submit" value="Register Vendor" />
                </form>
                <h3>Already a user?</h3>
                <Link to='/vendor/login'>Login!</Link>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.vendorAuth.isAuthenticated,
    error: state.error
  });
  
  export default connect(
    mapStateToProps,
    { signupVendor, clearErrors }
  )(SignUpVendor);