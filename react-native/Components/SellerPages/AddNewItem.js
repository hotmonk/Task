import React,{Component} from 'react';
import axios from 'axios';
import { Text,Picker,TextInput, View } from 'react-native';;

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
        axios.get('https://192.168.43.199:4000/categories')
            .then(function(response){
                this.setState({
                    categories:response,
                });
            })
            .catch((error)=>{
                console.log(error);
            })

        if(this.state.categories.length){
            axios.get('https://192.168.43.199:4000/categories/'+this.state.categories[0].key+'/subcat')
                .then(function(response){
                    this.setState({
                        subcategories:response,
                        category_id:this.state.categories[0].key,
                        subcat_id:response[0].key
                    });
                })
                .catch((error)=>{
                    console.log(error);
                })
        }
        this.handleCategory=this.handleCategory.bind(this);
        this.handleQuantity=this.handleQuantity.bind(this);
        this.handleSubcategory=this.handleSubcategory.bind(this);
        this.submitHandler=this.submitHandler.bind(this);
    }

    submitHandler(event){
        event.preventDefault();
        const item = {
//            cust_id:this.props.id,
            cat_id:this.state.category_id,
            sub_cat_id:this.state.subcat_id,
            quantity:this.state.quantity,
            status:'inBid'
        }
        axios.post( 'https://192.168.43.199:4000/seller/'+item.cust_id+'/items', item )
            .then(res => console.log("Seller Logging In"));
    }

    handleCategory(event){
        let curid=event.target.value;
        axios.get('/categories/'+curid+'/subcat')
            .then(function(response){
                this.setState({
                    subcategories:response ,
                    category_id:curid,
                });
                if(response.length){
                    this.setState({
                        subcat_id:response[0].key
                    });
                }
            })
            .catch((error)=>{
                console.log(error);
            })
    }

    handleSubcategory(event){
        let curid=event.target.value;
        this.setState({
            subcat_id:curid,
        });

    }

    handleQuantity(event){
        this.setState({
            quantity:event.target.value
        });
    }

    render()
    {
        return (
             <View>
                <Picker onChange={this.handleCategory} value={this.state.category_id} >
                    {
                        this.state.categories.map(category=>{
                            <Picker.Item key={category.id} value={category.id}>
                                {category.name}
                            </Picker.Item>
                        })
                    }
                </Picker>
                {
                    this.state.subcategories ?(
                    <Picker onChange={this.handleSubcategory} value={this.state.subcat_id}>
                        {
                            this.state.subcategories.map(subcategory=>{
                                <Picker.Item key={subcategory.id} value={subcategory.id} >
                                    {subcategory.name}
                                </Picker.Item>
                            })
                        }
                    </Picker>)
                        :null
                }
                <View>
                    <TextInput value={this.props.quantity} onChange={this.handleQuantity} placeholder="quantity" />
                    <Text><strong>{this.state.quantity_type}</strong></Text>
                </View>

                <Text onPress={this.submitHandler}>Add new item</Text>
            </View>
        );
    }
};

export default ItemForm;
