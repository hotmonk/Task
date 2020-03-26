import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View,TextInput } from 'react-native';
import { connect } from 'react-redux';
import { sellerLogin } from '../../actions/sellerAuthActions';
import { clearErrors } from '../../actions/errorActions';
import { Actions } from 'react-native-router-flux';

class LoginSeller extends Component {

    constructor(props) {
        super(props);

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
    
    onSubmit=async()=> {

        const { email, password } = this.state;

        const seller = {
            email,
            password
        };

        // Attempt to login
        this.props.sellerLogin(seller);
        if(this.props.isAuthenticated)
        {
           Actions.sellerProfile()
        }
    }



    render() {
        return (
            <View>
                <Text/><Text/><Text/><Text/>
                <Text>NOT A SELLER?</Text>
                <Text onPress={() => Actions.vendorLogin()}>Login as vendor!</Text>
                <Text>Login as Seller!</Text>
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

                    <Text onPress={this.onSubmit} >Login Seller</Text>
                    <Text>Don't have an account?</Text>
                    <Text onPress={() => Actions.sellerSignUp()}>Sign Up!</Text>
                </View>
            </View>
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
