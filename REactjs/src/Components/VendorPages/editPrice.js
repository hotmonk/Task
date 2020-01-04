import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import VendorLogout from './LogoutVendor';
import axios from 'axios';
import {baseURL} from '../../../config/constants.js';

class editPrice extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            items:[]
        }
    }

    componentDidMount(){
        setTimeout(()=>{
            const config = {
                headers: {
                'Content-type': 'application/json'
                }
            };
            axios.get(baseURL+'/vendor/selections/'+this.props.vendorData.selection_id,config)
                .then(res=>{
                    this.setState({
                        items:res.data
                    })
                })
                .catch(e=>{
                    console.log(e);
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

      handlePriceChange(event,index){
          var items=this.state.items.map(item=>{
              return {...item}
          });
          items[index].price=event.target.value;
          this.setState({
              items:items
          })
      }

      deleteHandler(event,id){
        event.preventDefault();
        if(this.props.isAuthenticated){

            var body=JSON.stringify({
                ...this.state
            })
              // Headers
              const config = {
                  headers: {
                  'Content-type': 'application/json'
                  }
              };
            axios.put(baseURL+'/vendor/selections/'+this.props.vendorData.selection_id,body,config)
              .then(res=>{
                  return axios.delete( baseURL+'/vendor/selections/'+id,config);
              })
              .then(res => {
                  this.setState({
                    items:res.data
                  })
              })
              .catch(err=>{
                console.log("category add request failed.retry later",err)
              })
        }
      }

      submitForm(event)
      {
          event.preventDefault();

          var body=JSON.stringify({
              ...this.state
          })
            // Headers
            const config = {
                headers: {
                'Content-type': 'application/json'
                }
            };
          axios.put(baseURL+'/vendor/selections/'+this.props.vendorData.selection_id,body,config)
            .then(res=>{
                this.props.history.push('/vendor/profile');
            })
            .catch(err=>{
                console.log(err);
            })
      }
  
    // static propTypes = {
    //     vendorData:PropTypes.isRequired,
    //     isAuthenticated: PropTypes.bool,
    //     error: PropTypes.object.isRequired,
    //     clearErrors: PropTypes.func.isRequired
    //   };

      render(){
          return (
            <div>
              {this.props.isAuthenticated ? (
            <div>
              <VendorLogout/>
              <div>
                    {
                      this.state.items&&this.state.items.length ?(
                        <ul>
                          {
                            this.state.items.map((selected,index)=>(
                              <li key={selected._id}>
                                <div>Category:{selected.subcat_id.cat_id.name}</div>
                                <div>Sub-category:{selected.subcat_id.name}</div>
                                <div>Price:<input type="text" onChange={(event)=>this.handlePriceChange(event,index)} value={selected.price}/>  {selected.subcat_id.quantity_type}</div>
                                <button onClick={(event)=>this.deleteHandler(event,selected._id)}>Delete</button>
                              </li>
                            ))
                          }
                        </ul>
                      ):(
                        <div><strong>You have selected no prefered category</strong></div>
                      )
                    }
                </div>
                <button onClick={(event)=>this.submitForm(event)}>save changes</button>
                <Link to='/vendor/profile'>Go to profile page!</Link>
            </div>
            ) : (
                <h4>Please Login First!</h4>
              )}
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

export default connect(mapStateToProps,null)(editPrice);