import React, {Component} from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';
import { Text, FlatList, StyleSheet,View } from 'react-native';
import SellerLogout from './LogoutSeller';
import {baseURL} from '../../config/constants.js';
import { Actions } from 'react-native-router-flux';

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
            this.props.history.push('sellerLogin');
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
            <View>
            {
                this.state.item?(
                <View>
                   <Text onPress={this.handleBack}>Go Back</Text>
                   <Text> Item Details:</Text>
                   <Text> category: {this.state.item.cat_id.name}</Text>
                   <Text> subcategory: {this.state.item.sub_cat_id.name}</Text>
                   <Text> quantity: {this.state.item.quantity}</Text>{this.state.item.sub_cat_id.quantity_type}

                </View>
            ):(
            <View>
                <Text>Here are all the items for sale</Text>
               {this.state.items? this.state.items.map(item=>{
                                return (<View key={item._id} onPress={()=>this.handleList(item)}>
                                    <Text>category:{item.cat_id.name}</Text>
                                    <Text> subcategory:{item.sub_cat_id.name}</Text>
                                    <Text>quantity:{item.quantity}{item.sub_cat_id.quantity_type} {"\n"}</Text>
                                </View>)
                            }) : (<Text>No Items to display</Text>)}
            </View>
            )
            }
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
  )(ViewItem);
