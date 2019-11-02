import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import VendorLogout from './LogoutVendor';
import axios from 'axios';

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
        if(this.props.isAuthenticated){
          axios.get(process.env.REACT_APP_BASE_URL+'/categories')
              .then((response)=>{
                  this.setState({
                      categories:response.data
                  });
                  if(this.state.categories && this.state.categories.length){
                      axios.get(process.env.REACT_APP_BASE_URL+'/categories/'+this.state.categories[0].key+'/subcat')
                          .then((response)=>{
                              this.setState({
                                  subcategories:response.data,
                                  category_id:this.state.categories[0].key,
                                  subcat_id:response.data[0].key
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

          axios.get(process.env.REACT_APP_BASE_URL+'vendor/selections/'+this.props.vendorData.selection_id)
      }
    }
    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
          // Check for register error
          if (error.id === 'VENDOR_REGISTER_FAIL') {
            this.setState({ msg: error.msg.msg });
          } else {
            this.setState({ msg: null });
          }
        }else{
          this.props.history.push('/vendor/login');
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

    handlePrice(event){
        this.setState({
            price:event.target.value
        });
    }

    deleteHandler(id){
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
            config.headers['x-auth-vendor-token'] = token;
        }
        axios.delete( process.env.REACT_APP_BASE_URL+'/vendor/selections'+id,config)
            .then(res => {
                this.setState({
                  list:res.data,
                  present:false
                })
            })
            .catch(e=>{
                console.log("category add request failed.retry later")
            });
      }
    }

    submitHandler(event){
      event.preventDefault();
      var filtered=this.state.list.filter(subcat=>{
        return subcat.subcat_id===this.state.subcat_id
      })
      if(filtered&&filtered.length){
        this.setState({
          present:true
        })
        return ;
      }
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
            config.headers['x-auth-vendor-token'] = token;
        }
        const item = JSON.stringify({
          vendorid:this.props.vendorData.id,
          subcat_id:this.state.subcat_id,
          price:this.state.price
        });
        axios.post( process.env.REACT_APP_BASE_URL+'/vendor/selections'+this.props.vendorData.selection_id, item ,config)
            .then(res => {
                this.setState({
                  list:res.data,
                  present:false
                })
            })
            .catch(e=>{
                console.log("category add request failed.retry later")
            });
      }
    }

      render(){
          return (
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
                                <input type="text" value={this.props.price} onChange={this.handlePrice} placeholder="enter price" />
                                <p><strong>Rs.</strong></p>
                            </div>
                        
                        <button>ADD</button>>
                    </form> ) : null
                }
                <div>
                    {
                      this.props.list&&this.props.list.length ?(
                        <ul>
                          {
                            this.state.list.map(selected=>(
                              <li>
                                <div>Category:{selected.subcat_id.cat_id.name}</div>
                                <div>Sub-category:{selected.subcat_id.name}</div>
                                <div>Price:{selected.price}  {selected.subcat_id.quantity_type}</div>
                                <button onClick={()=>this.deleteHandler(selected._id)}>Delete</button>
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
        );
      }
}

const mapStateToProps = state => ({
    vendorData:state.vendorAuth.vendor,
    isAuthenticated: state.vendorAuth.isAuthenticated,
    error: state.error
  });

export default connect(mapStateToProps,null)(chooseCat);
  
