import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sellerLogin } from '../../actions/sellerAuthActions';
import { clearErrors } from '../../actions/errorActions';
import {Redirect} from 'react-router-dom';

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

    redirectit=()=>{
        if(this.props.isAuthenticated)
        {
            return (
                <Redirect to='./additem' />
            )
        }
        
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

    

    render() {
        return (
            <div>
                { this.redirectit() }
                <h3>Login as Seller!</h3>
                <form onSubmit={this.onSubmit}>
                {this.state.msg ? (
                    console.log(this.state.msg)
                    ) : null}
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
  
const mapStateToProps = state => ({
    isAuthenticated: state.sellerAuth.isAuthenticated,
    error: state.error
  });
  
  export default connect(
    mapStateToProps,
    { sellerLogin, clearErrors }
  )(LoginSeller);
