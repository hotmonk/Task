import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sellerLogin } from '../../actions/sellerAuthActions';
import { clearErrors } from '../../actions/errorActions';
import {Redirect,Link} from 'react-router-dom';
import '../../styles/loginPage.css';

class LoginSeller extends Component {

    constructor(props) {
        super(props);

        this.onChangeemail = this.onChangeemail.bind(this);
        this.onChangepassword = this.onChangepassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.redirectit = this.redirectit.bind(this);

        this.state = {
            email: '',
            password: '',
            msg: null
        }
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        sellerLogin: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
      };

      componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
          if (error.id === 'SELLER_LOGIN_FAIL') {
            this.setState({ msg: error.msg.msg });
          } else {
            this.setState({ msg: null });
          }
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

        const { email, password } = this.state;

        const seller = {
            email,
            password
        };

        // Attempt to login
        this.props.sellerLogin(seller);
    }

    redirectit=()=>{
        if(this.props.isAuthenticated)
        {
            return (
                <Redirect to='./profile' />
            )
        }
        
    }

    render() {
        return (
            <div className="outerBox">
                <h4>NOT A SELLER?</h4>
                <Link to='/vendor/login'>Login as vendor!</Link>
                <br />
                <br />
                {this.redirectit()}
                <div className="box">
                    <h2 className="header">Login as Seller!</h2>
                    <form onSubmit={this.onSubmit}>
                        {this.state.msg ? (
                        console.log(this.state.msg)
                        ) : null}
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input type="email" value={this.state.email} onChange={this.onChangeemail} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input type="password" value={this.state.password} onChange={this.onChangepassword} className="form-control" id="exampleInputPassword1" />
                        </div>

                        <input className="btn btn-info" type="submit" value="Login Seller" />
                    </form>
                </div>
                <br />
                <br />
                <h3>New user?</h3>
                <Link to='/seller/signUp'>Sign Up!</Link>
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
    { sellerLogin, clearErrors }
  )(LoginSeller);
