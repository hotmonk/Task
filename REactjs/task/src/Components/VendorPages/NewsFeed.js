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
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        clearErrors: PropTypes.func.isRequired
      };
    
      componentDidMount() {
          if(this.props.isAuthenticated){
            const token = this.props.vendor.token;

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
            axios.get('http://localhost:4000/vendor/login/vendor', config)
                .then(response=>{
                    this.setState({
                        items:response
                    });
                })
                .catch(error=>{
                    console.log(error);
                })
          }
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
            {
                this.state.item?(
                <div>
                   <button onClick={this.handleBack}>Go Back</button>
                   <h1> Item Details:</h1>
                   <h2> category: {this.state.item.cat.name}</h2> 
                   <h2> subcategory: {this.state.item.subcat.name}</h2>
                   <h2> quantity: {this.state.item.quantity}</h2>{this.state.item.subcat.quantity_type}
                   
                </div>
            ):(
                <div>
                <h1>Here are all the items for sale</h1>
                <ul>
                {
                    this.state.items?
                        this.state.items.map(item=>{
                            return (<li key={item.id} onClick={this.handleList.bind(item)}>
                                category:{item.cat.name}  subcategory:{item.subcat.name}  quantity:{item.quantity}{item.subcat.quantity_type}
                            </li>)
                        }) : (<h1>No Items to display</h1>)
                    
                }
                </ul>
            </div>
            )
            }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    vendor:state.vendorAuth.vendor,
    isAuthenticated: state.vendorAuth.isAuthenticated,
    error: state.error
  });
  
  export default connect(
    mapStateToProps,
    { clearErrors }
  )(NewsFeed);