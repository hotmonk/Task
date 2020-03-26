import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View,TextInput } from 'react-native';
import { connect } from 'react-redux';
import { vendorLogin } from '../../actions/vendorAuthActions';
import { clearErrors } from '../../actions/errorActions';
import { Actions } from 'react-native-router-flux';

class LoginVendor extends Component {

    constructor(props) {
        super(props);

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
        const { error, isAuthenticated } = this.props;
        if (error !== prevProps.error) {
          if (error.id === 'VENDOR_LOGIN_FAIL') {
            this.setState({ msg: error.msg.msg });
          } else {
            this.setState({ msg: null });
          }
        }
      }

      
    redirectit = () => {
        if(this.props.isAuthenticated)
        {
          Actions.vendorProfile()

        }

    }


    onSubmit(e) {
        e.preventDefault();

        const { email, password } = this.state;

        const vendor = {
            email,
            password
        };

        // Attempt to login
        console.log(email);
        console.log(password);
        this.props.vendorLogin(vendor);
    }

    render() {
        return (
          <View>
            <Text/><Text/><Text/><Text/>
            <Text>NOT A VENDOR?</Text>
                {/* <Link to='/seller/login'>Login as seller!</Link> */}
                <Text onPress={() => Actions.sellerLogin()}>Login as seller!</Text>
              {this.redirectit()}
              <Text>Login as Vendor!</Text>
              <View >
              {this.state.msg ? (
                  console.log(this.state.msg)
                  ) : null}
                  <View>
                    <Text>Email: </Text>
                    <TextInput
                            value={this.state.email}
                            onChangeText={(email) => this.setState({ email })}
                            />
                  </View>
                  <View>
                    <Text>Password: </Text>
                    <TextInput
                            value={this.state.password}
                            onChangeText={(password) => this.setState({ password })}
                            />
                  </View>

                  <Text onPress={this.onSubmit} >Login Vendor</Text>

                  <Text>Don't have an account?</Text>
                    <Text onPress={() => Actions.vendorSignUp()}>Sign Up!</Text>
              </View>
          </View>
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
