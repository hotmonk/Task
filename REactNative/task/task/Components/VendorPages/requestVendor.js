import React, {Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { StyleSheet, Text, View,TextInput } from 'react-native';
import { clearErrors } from '../../actions/errorActions';
import VendorLogout from './LogoutVendor';
import {baseURL} from '../../config/constants.js';
import { Actions } from 'react-native-router-flux';

class vendorRequest extends Component {

    constructor(props) {
        super(props);
        this.onChangecat_name = this.onChangecat_name.bind(this);
        this.onChangesub_cat_name = this.onChangesub_cat_name.bind(this);
        this.onChangequantity_type = this.onChangequantity_type.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            cat_name: '',
            sub_cat_name: '',
            quantity_type: ''
        }
    }
    
    // componentDidUpdate()
    // {
    //     if(!this.props.isLoading&&!this.props.isAuthenticated){
    //         this.props.history.push('/vendor/login');
    //     }
    // }

    onChangecat_name(e) {
        this.setState({
            cat_name: e.target.value
        });
    }

    onChangesub_cat_name(e) {
        this.setState({
            sub_cat_name: e.target.value
        });
    }

    onChangequantity_type(e) {
        this.setState({
            quantity_type: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const newTypeWaste = {
            cat_name: this.state.cat_name,
            sub_cat_name: this.state.sub_cat_name,
            quantity_type: this.state.quantity_type,
            status: "Approved"
        }
        const config = {
              headers: {
              'Content-type': 'application/json'
              }
          };

        const body=JSON.stringify(newTypeWaste);
        axios.post(baseURL+'/vendor/newWasteType', body,config)
            .then(res => 
                Actions.vendorProfile() 
            )
            .catch(err=>{
                console.log(err);
            })
    }

    render() {
        return (
            <View>
                <Text>Request for a new Category of Waste!</Text>
                <View>
                    <View>
                      <Text>Category Name: </Text>
                      <TextInput  type="text"
                              value={this.state.cat_name}
                              onChangeText={(cat_name) => this.setState({cat_name })}
                              />
                    </View>
                    <View>
                      <Text>Sub-Category Name: </Text>
                      <TextInput  type="text"
                             value={this.state.sub_cat_name}
                             onChangeText={(sub_cat_name) => this.setState({ sub_cat_name })}
                              />
                    </View>
                    <View>
                      <Text>Quantity-type: </Text>
                      <TextInput  type="text"
                              value={this.state.quantity_type}
                              onChangeText={(quantity_type) => this.setState({ quantity_type })}
                              />
                    </View>

                    <Text onPress={this.onSubmit}>Add a new type of waste</Text>
                </View>
            </View>
        )
    }
}


export default vendorRequest;
