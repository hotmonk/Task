import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux'

class SignUpSeller extends Component {

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

        axios.post('http://localhost:4000/NewWasteType', newTypeWaste)
            .then(res => console.log("hii"));

        this.setState({
            cat_name: '',
            sub_cat_name: '',
            quantity_type: '',
        })
    }

    render() {
        return (
            <div>
                <h3>Request for a new Category of Waste!</h3>
                <form onSubmit={this.onSubmit}>
                      <label>Category Name: </label>
                      <input  type="text"
                              value={this.state.name}
                              onChange={this.onChangecat_name}
                              />
                      <label>Sub-Category Name: </label>
                      <input  type="text"
                              value={this.state.email}
                              onChange={this.onChangesub_cat_name}
                              />
                      <label>Quantity-type: </label>
                      <input  type="text"
                              value={this.state.contact}
                              onChange={this.onChangequantity_type}
                              />

                      <input type="submit" value="Add a new type of waste" />
                </form>
            </div>
        )
    }
}

const mapStateToProps =state=>{
    return {
      id:state.id
    };
  };
  
const mapDispatchToProps=dispatch=>{
    return {
        onLogin:(id)=> dispatch({type:'LOGIN',id:id})
    }
};
  
  
export default connect(mapStateToProps,mapDispatchToProps)(SignUpSeller);
