import React, {Component} from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';
import { Link } from 'react-router-dom';
import SellerLogout from './LogoutSeller';
import StarRatingComponent from 'react-star-rating-component';

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
        if(this.props.isAuthenticated){
            // Headers
            const config = {
                headers: {
                'Content-type': 'application/json'
                }
            };
            axios.get(process.env.REACT_APP_BASE_URL+'/seller/'+this.props.seller._id+'/viewSelledItem', config)
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
              item:null,
              rating:1
          })
      }

      handleByStatus(){
        if(this.state.item.status==="RATING"){
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
        axios.post(process.env.REACT_APP_BASE_URL+'/seller/'+this.props.seller._id+'/saveRating',sitem, config)
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