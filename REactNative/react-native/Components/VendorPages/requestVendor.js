import React, {Component} from 'react';
import axios from 'axios';
import { StyleSheet, Text, View,TextInput } from 'react-native';

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

        console.log(`Form submitted:`);
        console.log(`cat_name ${this.state.cat_name}`);
        console.log(`sub_cat_name: ${this.state.sub_cat_name}`);
        console.log(`quantity_type: ${this.state.quantity_type}`);

        const newTypeWaste = {
            cat_name: this.state.cat_name,
            sub_cat_name: this.state.sub_cat_name,
            quantity_type: this.state.quantity_type,
            status: "Approved"
        }

        axios.post('http://localhost:4000/vendor/newWasteType', newTypeWaste)
            .then(res => console.log("hii"));

        this.setState({
            cat_name: '',
            sub_cat_name: '',
            quantity_type: '',
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
                              value={this.state.name}
                              onChange={this.onChangecat_name}
                              />
                    </View>
                    <View>
                      <Text>Sub-Category Name: </Text>
                      <TextInput  type="text"
                              value={this.state.email}
                              onChange={this.onChangesub_cat_name}
                              />
                    </View>
                    <View>
                      <Text>Quantity-type: </Text>
                      <TextInput  type="text"
                              value={this.state.contact}
                              onChange={this.onChangequantity_type}
                              />
                    </View>

                    <Text onPress={this.onSubmit}>Add a new type of waste</Text>
                </View>
            </View>
        )
    }
}


export default vendorRequest;
