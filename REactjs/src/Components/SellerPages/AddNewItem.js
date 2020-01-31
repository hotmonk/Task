import React,{Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { clearErrors } from '../../actions/errorActions';
import { Link } from 'react-router-dom';
import SellerLogout from './LogoutSeller';
import {baseURL} from '../../../config/constants.js';

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
            subcategories:null,
            selectedImage:null,
            description:null
        }
        this.handleCategory=this.handleCategory.bind(this);
        this.handleQuantity=this.handleQuantity.bind(this);
        this.handleSubcategory=this.handleSubcategory.bind(this);
        this.submitHandler=this.submitHandler.bind(this);
        this.handleImageSelect=this.handleImageSelect.bind(this);
        this.handleDescription=this.handleDescription.bind(this);
    }

    componentDidMount(){
        setTimeout(()=>{
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
        },500);
    }

    componentDidUpdate()
    {
        if(!this.props.isLoading&&!this.props.isAuthenticated){
            this.props.history.push('/seller/login');
        }
    }

    handleCategory(event){
        let curid=event.target.value;
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

    handleDescription(event){
        this.setState({
            description:event.target.value
        });
    }

    handleImageSelect(e){
        e.preventDefault();
        let selectedImage;
        try{
            // Select single file
            selectedImage = e.target.files[0];
            if(selectedImage === undefined)
                selectedImage = null;
        }catch(err){ // Any error
            selectedImage = null;
        }
        // Update state
        this.setState({
            selectedImage: selectedImage
        });
    }; 

    submitHandler(event){
        event.preventDefault();
        if(this.props.isAuthenticated){
            // Headers
            // const config = {
            //     headers: {
            //     'Content-type': 'application/json'
            //     }
            // };
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };
            let data = new FormData();
            if(this.state.selectedImage){
                data.append('imageFile', this.state.selectedImage)
            }
            // Create user object
            data.append('cust_id',this.props.seller._id);
            data.append('cat_id',this.state.category_id);
            data.append('sub_cat_id',this.state.subcat_id);
            data.append('quantity',this.state.quantity);
            data.append('description',this.state.description);


            axios.post( baseURL+'/seller/' + this.props.seller._id + '/items', data,config)
                .then(res => {
                    console.log("Item added to the selling list")
                    this.props.history.push('/seller/items')
                })
                .catch(e=>{
                    console.log("item add request failed.retry later")
                });
          }
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

                            <div>
                                <textarea onChange={this.handleDescription} rows='25' cols='50' placeholder="Describe Your Item To the Vendor" >{this.props.description}</textarea>
                            </div>

                            <div>
                                <input type="file" name='imageFile' onChange={this.handleImageSelect} id="customImageSelector"/>
                                {!this.state.selectedFile
                                ?
                                (<label htmlFor="customImageSelector">Select an Image</label>)
                                :
                                (<label htmlFor="customImageSelector">{this.state.selectedFile.name}</label>)
                                }
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
    isLoading:state.sellerAuth.isLoading,
    token:state.sellerAuth.token,
    seller:state.sellerAuth.seller,
    isAuthenticated: state.sellerAuth.isAuthenticated,
    error: state.error
  });
  
  export default connect(
    mapStateToProps,
    { clearErrors }
  )(ItemForm);