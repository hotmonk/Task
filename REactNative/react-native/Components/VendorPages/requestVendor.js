import React, {Component} from 'react';
import axios from 'axios';
import { StyleSheet, Text, View,TextInput } from 'react-native';
import { connect } from 'react-redux';
import { clearErrors } from '../../actions/errorActions';
import VendorLogout from './LogoutVendor';
import {baseURL} from '../../config/constants.js';

class vendorRequest extends Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            cat_name: '',
            sub_cat_name: '',
            quantity_type: ''
        }
    }

    
    // componentDidUpdate()
    // {
    //     if(!this.props.isAuthenticated){
    //         this.props.history.push('vendorLogin');
    //     }
    // }

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
                console.log(done)
                //this.props.history.push('vendorProfile')  
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
                              onChangeText={(cat_name) => this.setState({ cat_name })}
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
                              onChangeText={(quantity_type) => this.setState({quantity_type })}
                              />
                    </View>

                    <Text onPress={this.onSubmit}>Add a new type of waste</Text>
                </View>
            </View>
        )
    }
}


export default vendorRequest;
