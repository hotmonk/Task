import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { signupVendor } from '../../actions/vendorAuthActions';
import { clearErrors } from '../../actions/errorActions';
import { Actions } from 'react-native-router-flux';
import { StyleSheet, Text, View,TextInput } from 'react-native';

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
            msg: null
        }
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        signupVendor: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
      };

      redirectit = () => {
        if(this.props.isAuthenticated)
        {
            Actions.vendorProfile()
        }

    }

      componentDidUpdate(prevProps) {
        const { error, isAuthenticated } = this.props;
        if (error !== prevProps.error) {
          // Check for register error
          if (error.id === 'VENDOR_REGISTER_FAIL') {
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

        console.log(`Form submitted:`);
        console.log(`name ${this.state.name}`);
        console.log(`Email: ${this.state.email}`);
        console.log(`Contact: ${this.state.contact}`);
        console.log(`Address: ${this.state.address}`);

        const { name, email, contact, address, password } = this.state;

        // Create user object
        const newVendor = {
        name,
        email,
        contact,
        address,
        password
        };

        this.props.signupVendor(newVendor);
    }

    render() {
        return (
            <View>
                { this.redirectit() }
                <Text>Register Yourself as Vendor!</Text>
                {this.state.msg ? (
                console.log(this.state.msg)
                ) : null}
                <View>
                    <View>
                      <Text>Name: </Text>
                      <TextInput  type="text"
                              value={this.state.name}
                              onChange={this.onChangename}
                              />
                    </View>
                    <View>
                      <Text>Email: </Text>
                      <TextInput  type="email"
                              value={this.state.email}
                              onChange={this.onChangeemail}
                              />
                    </View>
                    <View>
                      <Text>Contact </Text>
                      <TextInput  type="number"
                              value={this.state.contact}
                              onChange={this.onChangecontact}
                              />
                    </View>
                    <View>
                      <Text>Address: </Text>
                      <TextInput  type="text"
                              value={this.state.address}
                              onChange={this.onChangeaddress}
                              />
                    </View>
                    <View>
                      <Text>Password: </Text>
                      <TextInput  type="password"
                              value={this.state.password}
                              onChange={this.onChangepassword}
                              />
                    </View>

                    <Text onPress={this.onSubmit}>Register Vendor</Text>
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
    { signupVendor, clearErrors }
  )(SignUpVendor);
