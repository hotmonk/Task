import React, {Component} from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';
import { StyleSheet, Text, View,TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import SellerLogout from './LogoutSeller';
import StarRatingComponent from 'react-native-star-rating';

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
        this.props.history.push('sellerLogin');
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
                    <View>
                        <StarRatingComponent 
                            name="rate1"  
                            maxStars={5} 
                            rating={this.state.rating} height='10px'
                            selectedStar={this.onStarClick.bind(this)}
                        />
                        <Text onPress={ this.handleSaveBack.bind(this) }>Save and Go Back</Text>
                    </View>
                )
        }else if(this.state.item.status==='DONE'){
            return (
                    <View>
                        <StarRating 
                            name="rate2"  
                            maxStars={5} 
                            rating={this.state.item.transaction_id.rating} 
                            height='10px' 
                            disabled={false}
                            selectedStar={this.onStarClick.bind(this)}
                        />
                    </View>
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
            <View>
              {this.props.isAuthenticated ? (
            <View>
                <SellerLogout/>
                {
                    this.state.item?(
                    <View>
                        <Text onPress={this.handleBack}>Go Back</Text>
                        <Text> Item Details:</Text>
                        <Text> category: {this.state.item.cat_id.name}</Text> 
                        <Text> subcategory: {this.state.item.sub_cat_id.name}</Text>
                        <Text> quantity: {this.state.item.quantity}</Text>
                        {this.state.item.sub_cat_id.quantity_type}
                        {this.handleByStatus()}
                    </View>
                ):(
                    <View>
                    <Text>Here are all your items that are sold</Text>
                    <View>
                    {
                        this.state.items? this.state.items.map(item=>{
                                return (<View key={item._id} onClick={()=>this.handleList(item)}>
                                    <Text>category:{item.cat_id.name}</Text>
                                    <Text> subcategory:{item.sub_cat_id.name}</Text>
                                    <Text>quantity:{item.quantity}{item.sub_cat_id.quantity_type}</Text>
                                </View>)
                            }) : (<Text>No Items to display</Text>)
                        
                    }
                    </View>
                </View>
                )
                }
                <View>
                    <Text onPress={() => Actions.newItem()}>Add new Item</Text>
                </View>
            </View>
            ) : (
                <Text>Please Login First!</Text>
              )}
            </View>
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