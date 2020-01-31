import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';
import {Link} from 'react-router-dom';
import VendorLogout from './LogoutVendor';
import {baseURL} from '../../../config/constants.js';
import {Route} from 'react-router-dom';

class NewsFeed extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items:null,
            item:null,
            base64Flag : 'data:image/jpeg;base64,'
        }
        this.handleBack=this.handleBack.bind(this);
        this.handleAcceptance=this.handleAcceptance.bind(this);
        this.handleRejection=this.handleRejection.bind(this);
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        clearErrors: PropTypes.func.isRequired
      };

      componentDidMount(){
        setTimeout(()=>{
            if(this.props.isAuthenticated){
            // Headers
            const config = {
                headers: {
                'Content-type': 'application/json'
                }
            };

            axios.get(baseURL+'/vendor/newsfeed/'+this.props.vendor._id, config)
                .then(response=>{
                    //console.log(response.data);
                    this.setState({
                        items:response.data
                    });
                })
                .catch(error=>{
                    console.log(error);
                })
          }
        },500);
      }
    
    componentDidUpdate()
    {
        if(!this.props.isLoading&&!this.props.isAuthenticated){
            this.props.history.push('/vendor/login');
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
    
    handleAcceptance(item_id){
        const config = {
            headers: {
            'Content-type': 'application/json'
            }
        };
        const body=JSON.stringify({
            item_id
        })

        axios.post(baseURL+'/vendor/'+this.props.vendor._id+'/acceptOffer', body ,config)
            .then(response=>{
                console.log(response.data);
                const config = {
                    headers: {
                    'Content-type': 'application/json'
                    }
                };
                axios.get(baseURL+'/vendor/newsfeed/'+this.props.vendor._id, config)
                    .then(response=>{
                        this.setState({
                            items:response.data,
                            item:null
                        });
                    })
                    .catch(error=>{
                        console.log(error);
                    })
            })
            .catch(error=>{
                console.log(error);
            })
    }

    handleRejection(item_id){
        const config = {
            headers: {
            'Content-type': 'application/json'
            }
        };

        const body=JSON.stringify({
            item_id
        })

        axios.post(baseURL+'/vendor/'+this.props.vendor._id+'/rejectOffer', body ,config)
            .then(response=>{
                console.log(response.data);
                const config = {
                    headers: {
                    'Content-type': 'application/json'
                    }
                };
                axios.get(baseURL+'/vendor/newsfeed/'+this.props.vendor._id, config)
                    .then(response=>{
                        this.setState({
                            items:response.data,
                            item:null
                        });
                    })
                    .catch(error=>{
                        console.log(error);
                    })
            })
            .catch(error=>{
                console.log(error);
            })
    }

    render() {
        return (
            <div>
              {this.props.isAuthenticated ? (
                <div>
                    <VendorLogout/>
                    {
                        this.state.item? this.state.item.imageData? (
                        <div>
                            <button onClick={this.handleBack}>Go Back</button>
                            <h1> Item Details:</h1>
                            <h2> category: {this.state.item._doc.cat_id.name}</h2> 
                            <h2> subcategory: {this.state.item._doc.sub_cat_id.name}</h2>
                            <h2> quantity: {this.state.item._doc.quantity}</h2>{this.state.item._doc.sub_cat_id.quantity_type}
                             {/* <img src={this.state.base64Flag+this.state.item.imageData.data} alt="item image"></img> */}
                            <button onClick={()=>{this.handleAcceptance(this.state.item._doc._id)}}>Bid for it</button>
                            <button onClick={()=>{this.handleRejection(this.state.item._doc._id)}}>Reject it</button>
                        </div>
                    ) : (
                        <div>
                            <button onClick={this.handleBack}>Go Back</button>
                            <h1> Item Details:</h1>
                            <h2> category: {this.state.item.cat_id.name}</h2> 
                            <h2> subcategory: {this.state.item.sub_cat_id.name}</h2>
                            <h2> quantity: {this.state.item.quantity}</h2>{this.state.item.sub_cat_id.quantity_type}
                            <button onClick={()=>{this.handleAcceptance(this.state.item._id)}}>Bid for it</button>
                            <button onClick={()=>{this.handleRejection(this.state.item._id)}}>Reject it</button>
                        </div>
                    )
                    :(
                        <div>
                            <h1>Here are all the items for offer</h1>
                            <ul>
                            {
                                this.state.items? this.state.items.map(item=>{
                                    if(!item.imageData){
                                        return (<li key={item._id} onClick={()=>this.handleList(item)}>
                                            <div>category:{item.cat_id.name}</div><div> subcategory:{item.sub_cat_id.name}</div>
                                            <div>quantity:{item.quantity}{item.sub_cat_id.quantity_type}</div>
                                        </li>)
                                    }else{
                                        return (<li key={item._doc._id} onClick={()=>this.handleList(item)}>
                                            <div>category:{item._doc.cat_id.name}</div><div> subcategory:{item._doc.sub_cat_id.name}</div>
                                            <div>quantity:{item._doc.quantity}{item._doc.sub_cat_id.quantity_type}</div>
                                        </li>)
                                    }
                                }) : (<h1>No Items to display</h1>)
                                
                            }
                            </ul>
                        </div>
                    )
                    }
                    <div>
                            <Link to='/vendor/viewBuyedItems'>View all purchased items</Link>
                    </div>
                    <div>
                            <Link to='/vendor/newWasteType'>Request for new category or sub-category</Link>
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
    isLoading:state.vendorAuth.isLoading,
    token:state.vendorAuth.token,
    vendor:state.vendorAuth.vendor,
    isAuthenticated: state.vendorAuth.isAuthenticated,
    error: state.error
  });
  
  export default connect(
    mapStateToProps,
    { clearErrors }
  )(NewsFeed);