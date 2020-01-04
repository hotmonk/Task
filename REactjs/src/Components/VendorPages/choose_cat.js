import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import VendorLogout from './LogoutVendor';
import axios from 'axios';
import {baseURL} from '../../../config/constants.js';

class chooseCat extends Component {
    constructor(props){
        super(props);
        this.state={
            list:null,
            category_id:null,
            subcat_id:null,
            formIsValid:false,
            categories:null,
            subcategories:null,
            price:0,
            present:false
        }
        this.handleCategory=this.handleCategory.bind(this);
        this.handlePrice=this.handlePrice.bind(this);
        this.handleSubcategory=this.handleSubcategory.bind(this);
        this.submitHandler=this.submitHandler.bind(this);
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
                            .then((response)=>{
                                this.setState({
                                    subcategories:response.data,
                                    category_id:this.state.categories[0].key,
                                    subcat_id:response.data[0].key
                                })
                            })
                            .then(()=>{
                              // Headers
                              const config = {
                                  headers: {
                                  'Content-type': 'application/json'
                                  }
                              };
                              axios.get(baseURL+'/vendor/selections/'+this.props.vendorData.selection_id,config)
                                  .then(res=>{
                                      this.setState({
                                          list:res.data
                                      })
                                  })
                                  .catch(e=>{
                                      console.log(e);
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

    componentDidUpdate(prevProps) {
        if(!this.props.isLoading&&!this.props.isAuthenticated){
          this.props.history.push('/vendor/login');
        }
        const { error } = this.props;
        if (error !== prevProps.error) {
          // Check for register error
          if (error.id === 'VENDOR_REGISTER_FAIL') {
            this.setState({ msg: error.msg.msg });
          } else {
            this.setState({ msg: null });
          }
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
                        subcat_id:response.data[0].key,
                        present:false
                    });
                }else{
                    this.setState({
                        subcategories:response.data ,
                        category_id:curid,
                        subcat_id:null,
                        present:false
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
            present:false
        });
        
    }

    handlePrice(event){
        this.setState({
            price:event.target.value
        });
    }

    // deleteHandler(id){
    //   if(this.props.isAuthenticated){
    //     // Headers
    //     const config = {
    //         headers: {
    //         'Content-type': 'application/json'
    //         }
    //     };
    //     axios.delete( baseURL+'/vendor/selections/'+id,config)
    //         .then(res => {
    //             this.setState({
    //               list:res.data,
    //               present:false
    //             })
    //         })
    //         .catch(e=>{
    //             console.log("category add request failed.retry later"+e)
    //         });
    //   }
    // }

    submitHandler(event){
      event.preventDefault();
      var filtered=this.state.list.filter(subcat=>{
        return subcat.subcat_id._id===this.state.subcat_id
      })
      if(filtered&&filtered.length){
        this.setState({
          present:true
        })
        return ;
      }
      if(this.props.isAuthenticated){
        // Headers
        const config = {
            headers: {
            'Content-type': 'application/json'
            }
        };
        const item = JSON.stringify({
          vendorid:this.props.vendorData._id,
          subcat_id:this.state.subcat_id,
          price:this.state.price
        });
        axios.post( baseURL+'/vendor/selections/'+this.props.vendorData.selection_id, item ,config)
            .then(res => {
                this.setState({
                  list:res.data,
                  present:false
                })
            })
            .catch(e=>{
                console.log("category add request failed.retry later",e)
            });
      }
    }

      render(){
          return (
            <div>
                <div>
                    {this.state.present? (<h1>Item already present in the list</h1>):null}
                </div>
                <div>
                {this.props.isAuthenticated ? (
                        <div>
                            <VendorLogout/>
                            <Link to='/vendor/profile'>Done Adding!</Link>
                        {   this.state.categories ? (
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
                                        <div><strong>Rs.</strong><input type="text" value={this.props.price} onChange={this.handlePrice} placeholder="enter price" /></div>
                                    </div>
                                
                                <button>ADD</button>
                            </form> ) : null
                        }
                        <div>
                            {
                            this.state.list&&this.state.list.length ?(
                                <ul>
                                {
                                    this.state.list.map(selected=>(
                                    <li key={selected._id}>
                                        <div>Category:{selected.subcat_id.cat_id.name}</div>
                                        <div>Sub-category:{selected.subcat_id.name}</div>
                                        <div>Price:{selected.price}  {selected.subcat_id.quantity_type}</div>
                                        {/* <button onClick={()=>this.deleteHandler(selected._id)}>Delete</button> */}
                                    </li>
                                    ))
                                }
                                </ul>
                            ):(
                                <div><strong>You have selected no prefered category</strong></div>
                            )
                            }
                        </div>
                        <Link to='/vendor/profile'>Done!</Link>
                    </div>
                    ) : (
                        <h4>Please Login First!</h4>
                    )}
                </div>
              
            </div>
        );
      }
}

const mapStateToProps = state => ({
    isLoading:state.vendorAuth.isLoading,
    token:state.vendorAuth.token,
    vendorData:state.vendorAuth.vendor,
    isAuthenticated: state.vendorAuth.isAuthenticated,
    error: state.error
  });

export default connect(mapStateToProps,null)(chooseCat);
  
