import React, {Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { clearErrors } from '../../actions/errorActions';
import VendorLogout from './LogoutVendor';
import {baseURL} from '../../../config/constants.js';
import Navbar from './Navbar';

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
    
    componentDidUpdate()
    {
        if(!this.props.isLoading&&!this.props.isAuthenticated){
            this.props.history.push('/vendor/login');
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
                this.props.history.push('/vendor/profile')  
            )
            .catch(err=>{
                console.log(err);
            })
    }

    render() {
        return (
            <div>
              {this.props.isAuthenticated ? (
            <div>
                <Navbar />
                <VendorLogout/>
                <h3>Request for a new Category of Waste!</h3>
                <form onSubmit={this.onSubmit}>
                    <div>
                      <label>Category Name: </label>
                      <input  type="text"
                              value={this.state.cat_name}
                              onChange={this.onChangecat_name}
                              />
                    </div>
                    <div>
                      <label>Sub-Category Name: </label>
                      <input  type="text"
                              value={this.state.sub_cat_name}
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

const mapStateToProps = state => ({
    isLoading:state.vendorAuth.isLoading,
    token:state.vendorAuth.token,
    vendor:state.vendorAuth.vendor,
    isAuthenticated: state.vendorAuth.isAuthenticated,
    error: state.error
  });
  
  export default connect(
    mapStateToProps,
    { clearErrors }
  )(vendorRequest);
