import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { signupSeller } from '../../actions/sellerAuthActions';
import { clearErrors } from '../../actions/errorActions';
import { Actions } from 'react-native-router-flux';
import { StyleSheet, Text, View,TextInput } from 'react-native';

class SignUpSeller extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            contact: '',
            address: '',
            password: '',
            msg: null
        }
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        signupSeller: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
   };
    onSubmit=async()=> {

        console.log(`Form submitted:`);
        console.log(`name ${this.state.name}`);
        console.log(`Email: ${this.state.email}`);
        console.log(`Contact: ${this.state.contact}`);
        console.log(`Address: ${this.state.address}`);

        const { name, email, contact, address, password } = this.state;

        // Create user object
        const newSeller = {
        name,
        email,
        contact,
        address,
        password
        };
        this.props.signupSeller(newSeller);

        if(this.props.isAuthenticated)
        {
            console.log('Authenticated:');
        }
    }

    render() {
        return (
            <View>
                <Text>Register Yourself as Seller!</Text>
                <View>
                    <View>
                      <Text>Name: </Text>
                      <TextInput  type="text"
                              value={this.state.name}
                              onChangeText={(name) => this.setState({ name })}
                              />
                    </View>
                    <View>
                      <Text>Email: </Text>
                      <TextInput  type="email"
                              value={this.state.email}
                              onChangeText={(email) => this.setState({ email })}
                              />
                    </View>
                    <View>
                      <Text>Contact </Text>
                      <TextInput  type="number"
                              value={this.state.contact}
                              onChangeText={(contact) => this.setState({ contact })}
                              />
                    </View>
                    <View>
                      <Text>Address: </Text>
                      <TextInput
                              value={this.state.address}
                              onChangeText={(address) => this.setState({ address })}
                              />
                    </View>
                    <View>
                      <Text>Password: </Text>
                      <TextInput
                              value={this.state.password}
                              onChangeText={(password) => this.setState({ password })}
                              />
                    </View>

                    <Text onPress={this.onSubmit}>Register</Text>
                </View>
            </View>
        );
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
