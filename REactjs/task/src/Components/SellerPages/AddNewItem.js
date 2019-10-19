import React,{Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { clearErrors } from '../../actions/errorActions';

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
            axios.get('http://localhost:4000/categories')
                .then((response)=>{
                    console.log(response.data);
                    this.setState({
                        categories:response.data,
                    });
                })
                .catch((error)=>{
                    console.log(error);
                })
        }
        if(this.state.categories && this.state.categories.length){
            axios.get('https://localhost:4000/categories/'+this.state.categories[0].key+'/subcat')
                .then((response)=>{
                    console.log(response);
                    this.setState({
                        subcategories:response.data,
                        category_id:this.state.categories[0].key,
                        subcat_id:response.data[0].key
                    });
                })
                .catch((error)=>{
                    console.log(error);
                })
        }
    }

    submitHandler(event){
        event.preventDefault();
        const item = {
            cust_id:this.props.seller.id,
            cat_id:this.state.category_id,
            sub_cat_id:this.state.subcat_id,
            quantity:this.state.quantity,
            status:'inBid'
        }
        axios.post( 'http://localhost:4000/seller/' + item.cust_id + '/items', item )
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
            <div>
            {
                this.state.categories ? (
                    <form onSubmit={this.submitHandler}>
                    <select onChange={this.handleCategory} value={this.state.category_id} >
                        {
                            this.state.categories.map(category=>{
                                return (<option key={category.id} value={category.id}>
                                    {category.name}
                                </option>)
                            })
                        }
                    </select>
                    {
                        this.state.subcategories ?(
                        <select onChange={this.handleSubcategory} value={this.state.subcat_id}>
                            {
                                this.state.subcategories.map(subcategory=>{
                                    return (<option key={subcategory.id} value={subcategory.id} >
                                        {subcategory.name}
                                    </option>)
                                })
                            }
                        </select>)
                            :null
                    }
                    <div>
                        <input type="text" value={this.props.quantity} onChange={this.handleQuantity} placeholder="quantity" />
                        <p><strong>{this.state.quantity_type}</strong></p>
                    </div>
                    
                    <input type="submit" value="Add new item" />
                </form> ) : (<div>Sorry No vendor available</div>)
            }
            </div>
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