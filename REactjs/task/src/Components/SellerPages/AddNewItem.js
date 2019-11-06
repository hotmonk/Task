import React,{Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { clearErrors } from '../../actions/errorActions';
import { Link } from 'react-router-dom';
import SellerLogout from './LogoutSeller';

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
            axios.get(process.env.REACT_APP_BASE_URL+'/categories')
                .then((response)=>{
                    this.setState({
                        categories:response.data
                    });
                    if(this.state.categories && this.state.categories.length){
                        axios.get(process.env.REACT_APP_BASE_URL+'/categories/'+this.state.categories[0].key+'/subcat')
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
            this.props.history.push('/seller/login');
        }
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
                cust_id:this.props.seller.id,
                cat_id:this.state.category_id,
                sub_cat_id:this.state.subcat_id,
                quantity:this.state.quantity
            })
            axios.post( process.env.REACT_APP_BASE_URL+'/seller/' + this.props.seller.id + '/items', item ,config)
                .then(res => {
                    console.log("Item added to the selling list")
                    this.props.history.push('/seller/items')
                })
                .catch(e=>{
                    console.log("item add request failed.retry later")
                });
          }
    }

    handleCategory(event){
        let curid=event.target.value;
        axios.get(process.env.REACT_APP_BASE_URL+'/categories/'+curid+'/subcat')
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
              {this.props.isAuthenticated ? (
                <div>
                    <SellerLogout/>
                 {   this.state.categories&&this.state.categories.length ? (
                        <form onSubmit={this.submitHandler}>
                            <select onChange={this.handleCategory} value={this.state.cat_id} >
                                {
                                    this.state.categories.map(category=>{
                                        return (<option key={category.key} value={category.id}>
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
                                                { subcategory.name+' '+subcategory.quantity_type }
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
                        
                        <input type="submit" />
                    </form> ) : (<div>Sorry No vendor available</div>)
                }
                <div>
                    <Link to={"/seller/soldItems"}>View All the sold items by you</Link>
                </div>
            </div>
            ) : (
                <h4>Please Login First!</h4>
              )}
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