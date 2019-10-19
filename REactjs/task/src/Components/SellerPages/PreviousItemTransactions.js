import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';

class PreviousTransactions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items:null,
        }
        if(this.props.isAuthenticated){
            console.log(this.props.seller);
          const token = this.props.token;

          // Headers
          const config = {
              headers: {
              'Content-type': 'application/json'
              }
          };
  
          // If token, add to headers
          if (token) {
              config.headers['x-auth-seller-token'] = token;
          }
          axios.get('http://localhost:4000/seller/' + this.props.seller.id + '/previousTransactions', config)
              .then(response=>{
                  console.log(response.data);
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

    render() {
        return(
            <div>
            {
                <div>
                    <h1>Here are all your Previous Transactions</h1>
                    <ul>
                    {
                        this.state.items? this.state.items.map(item=>{
                                return (<li key={item.id}>
                                    category:{item.cat.name}  subcategory:{item.subcat.name}  quantity:{item.quantity}{item.subcat.quantity_type}
                                </li>)
                            }) : (<h1>No Items to display</h1>)
                        
                    }
                    </ul>
                </div>
            }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    token:state.sellerAuth.token,
    seller:state.sellerAuth.seller,
    isAuthenticated: state.sellerAuth.isAuthenticated,
    error: state.error
  });
  
  export default connect(
    mapStateToProps,
    { clearErrors }
  )(PreviousTransactions);