import React, {Component} from 'react';
import axios from 'axios';

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
            <div>
              {this.props.isAuthenticated ? (
            <div>
                <h3>Request for a new Category of Waste!</h3>
                <form onSubmit={this.onSubmit}>
                    <div>
                      <label>Category Name: </label>
                      <input  type="text"
                              value={this.state.name}
                              onChange={this.onChangecat_name}
                              />
                    </div>
                    <div>
                      <label>Sub-Category Name: </label>
                      <input  type="text"
                              value={this.state.cat_name}
                              onChange={this.onChangesub_cat_name}
                              />
                    </div>
                    <div>
                      <label>Quantity-type: </label>
                      <input  type="text"
                              value={this.state.contact}
                              onChange={this.onChangequantity_type}
                              />
                    </div>

                    <input type="submit" value="Add a new type of waste" />
                </form>
            </div>
            ) : (
                <h4>Please Login First!</h4>
              )}
            </div>
        )
    }
}
  
  
export default vendorRequest;
