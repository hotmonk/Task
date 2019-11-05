import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { vendorLogin } from '../../actions/vendorAuthActions';
import { clearErrors } from '../../actions/errorActions';
import { Redirect, Link} from 'react-router-dom';

class LoginVendor extends Component {

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
        vendorLogin: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
      };

      componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
          if (error.id === 'VENDOR_LOGIN_FAIL') {
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

    redirectit=()=>{
        if(this.props.isAuthenticated)
        {
            return (
                <Redirect to='./profile' />
            )
        }
        
    }

    onChangepassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const { email, password } = this.state;

        const vendor = {
            email,
            password
        };

        // Attempt to login
        this.props.vendorLogin(vendor);
    }

    render() {
        return (
            <div>
                <h2>NOT A VENDOR?</h2>
                <Link to='/seller/login'>Login as seller!</Link>
                {this.redirectit()}
                <h3>Login as Vendor!</h3>
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

                    <input type="submit" value="Login Vendor" />
                </form>
                <h3>New user?</h3>
                <Link to='/vendor/signUp'>Sign Up!</Link>
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
    { vendorLogin, clearErrors }
  )(LoginVendor);