import React, {Component} from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';
import { Link } from 'react-router-dom';
import SellerLogout from './LogoutSeller';
import {baseURL} from '../../../config/constants.js';

class ViewItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items:null,
            item:null
        }
        this.handleBack=this.handleBack.bind(this);
    }

    componentDidMount(){
        if(this.props.isAuthenticated){
  
            // Headers
            const config = {
                headers: {
                'Content-type': 'application/json'
                }
            };
            axios.get(baseURL+'/seller/'+this.props.seller._id+'/viewItem', config)
                .then(response=>{
                    console.log(response);
                    this.setState({
                        items:response.data
                    })
                })
                .catch(error=>{
                    console.log(error);
                })
          }
    }

    componentDidUpdate()
    {
        if(!this.state.isLoading&&!this.props.isAuthenticated){
            this.props.history.push('/seller/login');
        }
    }

      handleBack(){
          this.setState({
              item:null
          })
      }

      handleList(item){
          this.setState({
              item
          });
      }

    render() {
        return(
            
            <div>
              {this.props.isAuthenticated ? (
            <div>
                <SellerLogout/>
                {
                    this.state.item?(
                    <div>
                    <button onClick={this.handleBack}>Go Back</button>
                    <h1> Item Details:</h1>
                    <h2> category: {this.state.item.cat_id.name}</h2> 
                    <h2> subcategory: {this.state.item.sub_cat_id.name}</h2>
                    <h2> quantity: {this.state.item.quantity}</h2>{this.state.item.sub_cat_id.quantity_type}
                    
                    </div>
                ):(
                    <div>
                    <h1>Here are all the items for sale</h1>
                    <ul>
                    {
                        this.state.items? this.state.items.map(item=>{
                                return (<li key={item._id} onClick={()=>this.handleList(item)}>
                                    <div>category:{item.cat_id.name}</div><div> subcategory:{item.sub_cat_id.name}</div>
                                    <div>quantity:{item.quantity}{item.sub_cat_id.quantity_type}</div>
                                </li>)
                            }) : (<h1>No Items to display</h1>)
                        
                    }
                    </ul>
                </div>
                )
                }
                <div>
                    <Link to="./newItem">Add new Item</Link>
                </div>
                <div>
                    <Link to={"/seller/soldItems"}>View All the sold items by you</Link>
                </div>
            </div>
            ) : (
                <h4>Please Login First!</h4>
              )}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isLoading:state.sellerAuth.isLoading,
    token:state.sellerAuth.token,
    seller:state.sellerAuth.seller,
    isAuthenticated: state.sellerAuth.isAuthenticated,
    error: state.error
  });
  
  export default connect(
    mapStateToProps,
    { clearErrors }
  )(ViewItem);