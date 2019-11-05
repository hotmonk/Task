import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';
import {Link} from 'react-router-dom';
import VendorLogout from './LogoutVendor';

class NewsFeed extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items:null,
            item:null
        }
        this.handleBack=this.handleBack.bind(this);
        this.handlePurchase=this.handlePurchase.bind(this);
        if(this.props.isAuthenticated){
          const token = this.props.token;

          // Headers
          const config = {
              headers: {
              'Content-type': 'application/json'
              }
          };
  
          // If token, add to headers
          if (token) {
              config.headers['x-auth-vendor-token'] = token;
          }
          axios.get(process.env.REACT_APP_BASE_URL+'/vendor/newsfeed', config)
              .then(response=>{
                  this.setState({
                      items:response.data
                  });
              })
              .catch(error=>{
                  console.log(error);
              })
        }
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        clearErrors: PropTypes.func.isRequired
      };

      handlePurchase(){
        const token = this.props.token;
        const config = {
              headers: {
              'Content-type': 'application/json'
              }
          };
  
          // If token, add to headers
          if (token) {
              config.headers['x-auth-vendor-token'] = token;
          }

          const body=JSON.stringify({
              item_id:this.state.item.id,
              price:100
          })
          axios.post(process.env.REACT_APP_BASE_URL+'/vendor/'+this.props.vendor.id+'/transaction', body ,config)
              .then(response=>{
                  console.log(response.data);
                  this.props.history.push('/vendor/viewBuyedItems')
              })
              .catch(error=>{
                  console.log(error);
              })
      }

      handleList(item){
          this.setState({
              item
          });
      }

      handleBack(){
          this.setState({
              item:null
          })
      }

      componentDidUpdate()
    {
        if(!this.props.isAuthenticated){
            this.props.history.push('/vendor/login');
        }
    }

    render() {
        return(
            <div>
              {this.props.isAuthenticated ? (
            <div>
                 <VendorLogout/>
            {
                this.state.item?(
                <div>
                   <button onClick={this.handleBack}>Go Back</button>
                   <h1> Item Details:</h1>
                   <h2> category: {this.state.item.cat.name}</h2> 
                   <h2> subcategory: {this.state.item.subcat.name}</h2>
                   <h2> quantity: {this.state.item.quantity}</h2>{this.state.item.subcat.quantity_type}
                   <div>
                        <button onClick={this.handlePurchase}>Purchase it</button>
                   </div>
                </div>
                
            ):(
            <div>
                <h1>Here are all the items for sale</h1>
                <ul>
                {
                    this.state.items? this.state.items.map(item=>{
                            return (<li key={item.id} onClick={()=>this.handleList(item)}>
                            <div>category:{item.cat.name}</div><div> subcategory:{item.subcat.name}</div>
                                    <div>quantity:{item.quantity}{item.subcat.quantity_type}</div>
                            </li>)
                        }) : (<h1>No Items to display</h1>)
                    
                }
                </ul>
                <div>
                        <Link to='/vendor/viewBuyedItems'>View all purchased items</Link>
                </div>
                <div>
                        <Link to='/vendor/newWasteType'>Request for new category or sub-category</Link>
                </div>
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
    token:state.vendorAuth.token,
    vendor:state.vendorAuth.vendor,
    isAuthenticated: state.vendorAuth.isAuthenticated,
    error: state.error
  });
  
  export default connect(
    mapStateToProps,
    { clearErrors }
  )(NewsFeed);