import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import VendorLogout from './LogoutVendor';

class editPrice extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            items:[]
        }
        if(this.props.isAuthenticated){
            axios.get(process.env.REACT_APP_BASE_URL+'/categories')
                .then((response)=>{

                })
                .catch((error)=>{
                    console.log(error);
                })
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
        }
        if(!this.props.isAuthenticated){
            this.props.history.push('/vendor/login');
        }
      }

      handlePriceChange(event,index){
          var items=this.state.items.map(item=>{
              return {...item}
          });
          items[index].price=event.target.value;
          this.setState({
              items
          })
      }

      deleteHandler(event,id){
          event.preventDefault();
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

      submitForm(event)
      {
          event.preventDefault();

          var body=JSON.stringify({
              ...this.state
          })
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
          axios.put(process.env.REACT_APP_BASE_URL+'/vendor/selections'+this.props.vendorData.selection_id,body,config)
            .then(res=>{
                this.props.history('/vendor/profile');
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
                      this.props.list&&this.props.list.length ?(
                        <ul>
                          {
                            this.state.list.map((selected,index)=>(
                              <li>
                                <div>Category:{selected.subcat_id.cat_id.name}</div>
                                <div>Sub-category:{selected.subcat_id.name}</div>
                                <div>Price:<input type="text" onChange={()=>this.handlePriceChange(index)} value={selected.price}/>  {selected.subcat_id.quantity_type}</div>
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
                <button onClick={()=>this.submitForm}>save changes</button>
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
    token:state.vendorAuth.token,
    vendorData:state.vendorAuth.vendor,
    isAuthenticated: state.vendorAuth.isAuthenticated,
    error: state.error
  });

export default connect(mapStateToProps,null)(editPrice);