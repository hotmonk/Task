import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { clearErrors } from '../../actions/errorActions';
import { Text, FlatList, StyleSheet } from 'react-native';

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
            axios.get('http://localhost:4000/seller/'+this.props.seller.id+'/viewItem', config)
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
                <FlatList
                 data={this.state.items}
                 renderItem={({item}) => <Text>category:{item.key.cat_id.name} subcategory:{item.key.sub_cat_id.name}  quantity:{item.key.quantity}{item.key.sub_cat_id.quantity_type}</Text>}
                />
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
