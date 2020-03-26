import React,{Component} from 'react';
import axios from 'axios';
import { Text,Picker,TextInput, View, Button } from 'react-native';;
import { connect } from 'react-redux';
import { clearErrors } from '../../actions/errorActions';
import { Actions } from 'react-native-router-flux';
import SellerLogout from './LogoutSeller';
import {baseURL} from '../../config/constants.js';

class ItemForm extends Component
{
    constructor(props)
    {
        super(props);
        this.state={
            category_id:null,
            subcat_id:null,
            quantity:null,
            quantity_type:null,
            formIsValid:false,
            categories:null,
            subcategories:null
        }
        this.handleCategory=this.handleCategory.bind(this);
        this.handleQuantity=this.handleQuantity.bind(this);
        this.handleSubcategory=this.handleSubcategory.bind(this);
        this.submitHandler=this.submitHandler.bind(this);
        if(this.props.isAuthenticated){
            axios.get(baseURL+'/categories')
                .then((response)=>{
                    this.setState({
                        categories:response.data
                    });
                    if(this.state.categories && this.state.categories.length){
                        axios.get(baseURL+'/categories/'+this.state.categories[0].key+'/subcat')
                            .then((response2)=>{
                                this.setState({
                                    subcategories:response2.data,
                                    category_id:this.state.categories[0].key,
                                    subcat_id:response2.data[0].key
                                })
                            })
                            .catch((error)=>{
                                console.log(error);
                            })
                    }
                })
                .catch((error)=>{
                    console.log(error);
                })
        }
    }

    componentDidUpdate()
    {
        if(!this.props.isAuthenticated){
            Actions.sellerLogin();
        }
    }

    handleCategory(){
        let curid=this.state.category_id;
        axios.get(baseURL+'/categories/'+curid+'/subcat')
            .then((response)=>{
                if(response.data&&response.data.length){
                    this.setState({
                        subcategories:response.data ,
                        category_id:curid,
                        subcat_id:response.data[0].key
                    });
                }else{
                    this.setState({
                        subcategories:response.data ,
                        category_id:curid,
                        subcat_id:null
                    });
                }
            })
            .catch((error)=>{
                console.log(error);
            })
    }

    handleSubcategory(){
        let curid=this.state.subcat_id;
        this.setState({
            subcat_id:curid,
        });
        
    }

    handleQuantity(event){
        this.setState({
            quantity:event.target.value
        });
    }

    submitHandler(event){
        event.preventDefault();
        if(this.props.isAuthenticated){
            // Headers
            const config = {
                headers: {
                'Content-type': 'application/json'
                }
            };
            const item =JSON.stringify ({
                cust_id:this.props.seller._id,
                cat_id:this.state.category_id,
                sub_cat_id:this.state.subcat_id,
                quantity:this.state.quantity
            })
            console.log(item)
            axios.post( baseURL+'/seller/' + this.props.seller._id + '/items', item ,config)
                .then(res => {
                    console.log("Item added to the selling list")
                })
                .catch(e=>{
                    console.log("item add request failed.retry later")
                });
          }
    }

    
    render()
    {
        return (
            <View>
                <Text/><Text/><Text/><Text/>
              {this.props.isAuthenticated ? (
                <View>
                    <SellerLogout/>
            {
                this.state.categories ? (
                <View >
                    <Picker 
                     selectedValue={this.state.category_id} 
                     onValueChange={(itemValue, itemIndex) => this.setState({category_id: itemValue})}>
                        {
                            this.state.categories.map(category=>{
                                return(
                                <Picker.Item label={category.name} value={category.id} key={category.name}/>
                                );
                            })
                        }
                    </Picker>
                    <Button title="Click Here To Get Picker Selected Value" onPress={ this.handleCategory } />
                    {
                        this.state.subcategories ?(
                        <Picker 
                        onValueChange={(itemValue, itemIndex) => this.setState({subcat_id: itemValue})} 
                        selectedValue={this.state.subcat_id}>
                            {
                                this.state.subcategories.map(subcategory=>{
                                    return(
                                    <Picker.Item label={subcategory.name} value={subcategory.id} key={subcategory.name}/>);
                                })
                            }
                        </Picker>)
                            :<Text>No sub-category</Text>
                    }
                    <View>
                        <Text>Quantity:</Text>
                        <TextInput
                              value={this.state.quantity}
                              onChangeText={(quantity) => this.setState({ quantity })}
                              />
                    </View>

                    <Text onPress={this.submitHandler} >Add new item</Text>
                </View> ) : (<Text>Sorry No vendor available</Text>)
            }
                <View>
                    <Text onPress={() => Actions.sellerItems()}>View All the sold items by you</Text>
                </View>
            </View>
            ) : (
                <Text>Please Login First!</Text>
              )}
            </View>
        );
    }
};

const mapStateToProps = state => ({
    token:state.sellerAuth.token,
    seller:state.sellerAuth.seller,
    isAuthenticated: state.sellerAuth.isAuthenticated,
    error: state.error
  });

  export default connect(
    mapStateToProps,
    { clearErrors }
  )(ItemForm);
