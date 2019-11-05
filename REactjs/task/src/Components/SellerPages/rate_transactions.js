import React, {Component} from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';
import { Link } from 'react-router-dom';
import SellerLogout from './LogoutSeller';

class ViewSelledItem extends Component {

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
            axios.get(process.env.REACT_APP_BASE_URL+'/seller/'+this.props.seller.id+'/viewRateItem', config)
                .then(response=>{
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
      if(!this.props.isAuthenticated){
        this.props.history.push('/seller/login');
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
                    <Link to='/seller/rating'>Click here to rate!</Link>
                    </div>
                ):(
                    <div>
                    <h1>Here are all your items that are to be rated</h1>
                    <ul>
                    {
                        this.state.items? this.state.items.map(item=>{
                                return (<li key={item._id} onClick={()=>this.handleList(item)}>
                                    <div>category:{item.cat_id.name}</div><div> subcategory:{item.sub_cat_id.name}</div>
                                    <div>quantity:{item.quantity}{item.sub_cat_id.quantity_type}</div>
                                    <Link to='/seller/rating'>Click here to rate!</Link>
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
    token:state.sellerAuth.token,
    seller:state.sellerAuth.seller,
    isAuthenticated: state.sellerAuth.isAuthenticated,
    error: state.error
  });
  
  export default connect(
    mapStateToProps,
    { clearErrors }
  )(ViewSelledItem);