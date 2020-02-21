import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View,TextInput } from 'react-native';
import { signupSeller } from '../../actions/sellerAuthActions';
import { clearErrors } from '../../actions/errorActions';
import { Actions } from 'react-native-router-flux';
import FetchLocation from '../commonComponents/FetchLocation';

class SignUpSeller extends Component {

    constructor(props) {
        super(props);
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
          Actions.sellerProfile()
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
            <View>
              {this.redirectit()}
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
                    <FetchLocation setCoords={(long,lat)=>{this.setCoord(long,lat)}} />
                    <Text onPress={this.onSubmit}>Register</Text>
                    <Text>Already have an account?</Text>
                    <Text onPress={() => Actions.sellerLogin()}>Login!</Text>
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
