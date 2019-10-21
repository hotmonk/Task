import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';

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
          axios.get('http://localhost:4000/vendor/newsfeed', config)
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
          console.log("request sent");
          axios.post('http://localhost:4000/vendor/'+this.props.vendor.id+'/transaction', body ,config)
              .then(response=>{
                  console.log(response.data),
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

    render() {
        return(
            <div>
              {this.props.isAuthenticated ? (
            <div>
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
                                category:{item.cat.name}  subcategory:{item.subcat.name}  quantity:{item.quantity}{item.subcat.quantity_type}
                            </li>)
                        }) : (<h1>No Items to display</h1>)
                    
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
    token:state.vendorAuth.token,
    vendor:state.vendorAuth.vendor,
    isAuthenticated: state.vendorAuth.isAuthenticated,
    error: state.error
  });
  
  export default connect(
    mapStateToProps,
    { clearErrors }
  )(NewsFeed);