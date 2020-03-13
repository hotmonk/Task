import React, {Component} from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';
import SellerLogout from './LogoutSeller';
import StarRatingComponent from 'react-star-rating-component';
import {baseURL} from '../../../config/constants.js';
import Navbar from './Navbar';

class ViewSelledItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items:null,
            item:null,
            rating:1
        }
        this.handleBack=this.handleBack.bind(this);
    }

    componentDidMount(){
        setTimeout(()=>{
            // Headers
            const config = {
                headers: {
                'Content-type': 'application/json'
                }
            };
            axios.get(baseURL+'/seller/'+this.props.seller._id+'/viewSelledItem', config)
                .then(response=>{
                    this.setState({
                        items:response.data
                    })
                })
                .catch(error=>{
                    console.log(error);
                })
        },500);
            
    }

    componentDidUpdate()
    {
      if(!this.props.isLoading&&!this.props.isAuthenticated){
        this.props.history.push('/seller/login');
      }
    }

    handleBack(){
        this.setState({
            item:null,
            rating:1
        })
    }
    
    handleByStatus(){
        if(this.state.item.status==='PAYMENT'){
            return(
                <div>
                    <h3>Data of the Vendor selected for the current bid is</h3>
                    <p><strong>Name</strong>{this.state.item.transaction_id.vendor.name}</p>
                    <p><strong>Phone no</strong>{this.state.item.transaction_id.vendor.contact}</p>
                    <button onClick={ this.vendorReport.bind(this) }>Report the vendor for the item</button>
                </div>
            )
        }else if(this.state.item.status==="RATING"){
            return (
                    <div>
                        <StarRatingComponent 
                            name="rate1"  starCount={5} value={this.state.rating} height='10px' onStarClick={this.onStarClick.bind(this)}
                        />
                        <button onClick={ this.handleSaveBack.bind(this) }>Save and Go Back</button>
                    </div>
                )
        }else if(this.state.item.status==='DONE'){
            return (
                    <div>
                        <StarRatingComponent 
                            name="rate2"  starCount={5} value={this.state.item.transaction_id.rating} height='10px' editing={false}
                            onStarClick={this.onStarClick.bind(this)}
                        />
                    </div>
                )
        }else{
            return null;
        }
    }
    
    handleList(item){
        this.setState({
            item
        });
    }

      vendorReport(){
        const config = {
            headers: {
            'Content-type': 'application/json'
            }
        };

        const body=JSON.stringify({
            item_id:this.state.item._id
        })

        axios.post(baseURL+'/seller/'+this.props.seller._id+'/vendorReport',body, config)
            .then(response=>{
                console.log(response.data);
                const config = {
                    headers: {
                    'Content-type': 'application/json'
                    }
                };
                axios.get(baseURL+'/seller/'+this.props.seller._id+'/viewSelledItem', config)
                    .then(response=>{
                        this.setState({
                            items:response.data,
                            item:null
                        })
                    })
                    .catch(error=>{
                        console.log(error);
                    })
            })
            .catch(error=>{
                console.log(error);
            })
      }

    handleSaveBack(){
        const token = this.props.token;
  
        // Headers
        const config = {
            headers: {
            'Content-type': 'application/json'
            }
        };

        var sitem={
            transaction_id:this.state.item.transaction_id,
            rating:this.state.rating
        }
        // If token, add to headers
        if (token) {
            config.headers['x-auth-seller-token'] = token;
        }
        axios.post(baseURL+'/seller/'+this.props.seller._id+'/saveRating',sitem, config)
            .then(response=>{
                this.setState({
                    item:null,
                    rating:1
                })
            })
            .catch(error=>{
                console.log(error);
            })
    }

    onStarClick(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
    }

    render() {
        return(
            <div>
              {this.props.isAuthenticated ? (
            <div>
                <Navbar />
                <SellerLogout/>
                {
                    this.state.item?(
                    <div>
                        <button onClick={this.handleBack}>Go Back</button>
                        <h1> Item Details:</h1>
                        <h2> category: {this.state.item.cat_id.name}</h2> 
                        <h2> subcategory: {this.state.item.sub_cat_id.name}</h2>
                        <h2> quantity: {this.state.item.quantity}</h2>{this.state.item.sub_cat_id.quantity_type}
                        {this.handleByStatus()}
                    </div>
                ):(
                    <div>
                    <h1>Here are all your items that are sold</h1>
                    <ul>
                    {
                        this.state.items&&this.state.items.length? this.state.items.map(item=>{
                                return (<li key={item._id} onClick={()=>this.handleList(item)}>
                                    <div>category:{item.cat_id.name}</div><div> subcategory:{item.sub_cat_id.name}</div>
                                    <div>quantity:{item.quantity}{item.sub_cat_id.quantity_type}</div>
                                </li>)
                            }) : (<h1>No Items yet added to the category</h1>)
                        
                    }
                    </ul>
                </div>
                )
                }
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
  )(ViewSelledItem);