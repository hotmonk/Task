import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { signupSeller } from '../../actions/sellerAuthActions';
import { clearErrors } from '../../actions/errorActions';
import {Redirect,Link} from 'react-router-dom';
import FetchLocation from '../commonComponents/FetchLocation';
import '../../styles/signupPage.css';

class SignUpSeller extends Component {

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
            place: null,
            msg: null,
            latitude:null,
            longitude:null,
            locationEnabled:false
        }
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        signupSeller: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
      };
    
      componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
          // Check for register error
          if (error.id === 'SELLER_REGISTER_FAIL') {
            this.setState({ msg: error.msg.msg });
          } else {
            this.setState({ msg: null });
          }
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

        const { name, email, contact, address, password, latitude, longitude } = this.state;
        // Create user object
        const newSeller = {
        name,
        email,
        contact,
        address,
        password,
        latitude,
        longitude
        };

        this.props.signupSeller(newSeller);
    }
 
    redirectit=()=>{
        if(this.props.isAuthenticated)
        {
            return (
                <Redirect to='./profile' />
            )
        }
        
    }

    setCoord(long,lat){
        this.setState({
            longitude:long,
            latitude:lat
        });
    }

    render() {
        return (
            <div className="outerBox">
                {this.redirectit()}
                <div className="box">
                    <h2 className="header">Register Yourself as Seller!</h2>
                    {this.state.msg ? (
                    console.log(this.state.msg)
                    ) : null}
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                        <label>Name: </label>
                        <input className="form-control" type="text" value={this.state.name} onChange={this.onChangename} />
                        </div>

                        <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Email address</label>
                                <input type="email" value={this.state.email} onChange={this.onChangeemail} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>

                        <div className="form-group">
                        <label>Contact </label>
                        <input className="form-control" type="number" value={this.state.contact} onChange={this.onChangecontact} />
                        </div>

                        <div className="form-group">
                        <label>Address: </label>
                        <input className="form-control" type="text" value={this.state.address} onChange={this.onChangeaddress} />
                        </div>

                        <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Password</label>
                                <input type="password" value={this.state.password} onChange={this.onChangepassword} className="form-control" id="exampleInputPassword1" />
                        </div>
                        <FetchLocation setCoords={(long,lat)=>{this.setCoord(long,lat)}} />
                        <input className="btn btn-info" type="submit" value="Register Seller" />
                        </form>
                    </div>
                    <h3>Already have an account?</h3>
                    <Link to='/seller/login'>Login!</Link>
            </div>
        )
    }
}
  
const mapStateToProps = state => ({
    isAuthenticated: state.sellerAuth.isAuthenticated,
    error: state.error
  });
  
  export default connect(
    mapStateToProps,
    { signupSeller, clearErrors }
  )(SignUpSeller);
