import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { clearErrors } from "../../actions/errorActions";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { Actions } from "react-native-router-flux";
import SellerLogout from "./LogoutSeller";
import StarRatingComponent from "react-native-star-rating";
import { baseURL } from "../../config/constants.js";

class ViewSelledItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: null,
      item: null,
      rating: 1,
      reason:false,
      reasonDesc:null
    };
    this.handleBack=this.handleBack.bind(this);
    this.handleReason=this.handleReason.bind(this);
    this.vendorReport=this.vendorReport.bind(this);
    this.handleSaveBack=this.handleSaveBack.bind(this);
    this.onStarClick=this.onStarClick.bind(this);
    this.handleRecievedCash=this.handleRecievedCash.bind(this);
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      // Headers
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      };
      axios
        .get(
          baseURL + "/seller/" + this.props.seller._id + "/viewSelledItem",
          config
        )
        .then(response => {
          this.setState({
            items: response.data
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  componentDidUpdate() {
    if (!this.props.isAuthenticated) {
      Actions.sellerLogin();
    }
  }
  handleList(item) {
    this.setState({
      item
    });
  }

  handleReason(e) {
    this.setState({
      reasonDesc: e.target.value
    });
  }

  handleBack() {
    this.setState({
      item: null,
      rating: 1
    });
  }

  handleByStatus() {
    // PAYMENT STATUS PENDING
    if(this.state.item.status==='PAYMENT'){
      return(
           <View>
               <Text>Data of the Vendor selected for the current bid is</Text>
               <Text>Name: {this.state.item.transaction_id.vendor.name}</Text>
               <Text>Phone no: {this.state.item.transaction_id.vendor.contact}</Text>
              { 
                  
                  this.state.item.transaction_id.quantity_taken?(
                  <View><Text>Quantity collected by vendor {this.state.item.transaction_id.quantity_taken}</Text></View>):( <View><Text>quantity taken by vendor not yet updated</Text></View>)
                  
            
              }
               {
                   this.state.item.transaction_id.method?this.state.item.transaction_id.method==='COD'?(
                      <View>
                          <Text>Method of payment selected: Cash on delivery</Text>
                          <Text>Amount to be collected: {this.state.item.transaction_id.quantity_taken*this.state.item.transaction_id.price}</Text>
                          <Button title="received cash" onPress={this.handleRecievedCash}></Button>
                      </View>
                      
                  ):(<Text>Method of payment selected Online</Text>): (<Text>method of payment not yet updated not yet updated</Text>)
              }
              {
                  this.state.reason?(<TextInput onChangeText={this.handleReason} rows='25' cols='10' placeholder="state the reason for rejecting the vendor" >{this.state.reasonDesc}</TextInput>):null
              }
              {
                  <Button title="Report the vendor for the item" onClick={ this.vendorReport }/>
               }
          </View>
      )
  }else if (this.state.item.status === "RATING") {
      return (
        <View>
          <StarRatingComponent
            name="rate1"
            maxStars={5}
            rating={this.state.rating}
            height="10px"
            selectedStar={this.onStarClick}
          />
          <Text onPress={this.handleSaveBack}>Save and Go Back</Text>
        </View>
      );
    } else if (this.state.item.status === "DONE") {
      return (
        <View>
          <StarRatingComponent
            name="rate2"
            maxStars={5}
            rating={this.state.item.transaction_id.rating}
            height="10px"
            disabled={false}
            selectedStar={this.onStarClick}
          />
        </View>
      );
    } else {
      return null;
    }
  }
  handleSaveBack(){
    const token = this.props.token;

    // Headers
    const config = {
        headers: {
        'Content-type': 'application/json'
        }
    };

    var sitem={
        transaction_id:this.state.item.transaction_id,
        rating:this.state.rating
    }
    // If token, add to headers
    if (token) {
        config.headers['x-auth-seller-token'] = token;
    }
    axios.post(baseURL+'/seller/'+this.props.seller._id+'/saveRating',sitem, config)
        .then(response=>{
            this.setState({
                item:null,
                rating:1
            })
        })
        .catch(error=>{
            console.log(error);
        })
}
  vendorReport() {
    if (!this.state.reason) {
      this.setState({
        reason: true
      });
      return;
    }
    if (this.state.reasonDesc === null || this.state.reasonDesc === "") {
      return;
    }
    const config = {
      headers: {
        "Content-type": "application/json"
      }
    };

    const body = JSON.stringify({
      item_id: this.state.item._id
    });

    axios
      .post(
        baseURL + "/seller/" + this.props.seller._id + "/vendorReport",
        body,
        config
      )
      .then(response => {
        console.log(response.data);
        const config = {
          headers: {
            "Content-type": "application/json"
          }
        };
        axios
          .get(
            baseURL + "/seller/" + this.props.seller._id + "/viewSelledItem",
            config
          )
          .then(response => {
            this.setState({
              items: response.data,
              item: null
            });
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleSaveBack() {
    const token = this.props.token;

    // Headers
    const config = {
      headers: {
        "Content-type": "application/json"
      }
    };

    var sitem = {
      transaction_id: this.state.item.transaction_id,
      rating: this.state.rating
    };
    // If token, add to headers
    if (token) {
      config.headers["x-auth-seller-token"] = token;
    }
    axios
      .post(
        baseURL + "/seller/" + this.props.seller._id + "/saveRating",
        sitem,
        config
      )
      .then(response => {
        this.setState({
          item: null,
          rating: 1
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  onStarClick(nextValue, prevValue, name) {
    this.setState({ rating: nextValue });
  }

  handleRecievedCash() {
    // Headers
    console.log("cashed");
    const config = {
      headers: {
        "Content-type": "application/json"
      }
    };

    var body = {
      item_id: this.state.item._id
    };

    axios
      .post(
        baseURL + "/seller/" + this.props.seller._id + "/cashRecieved",
        body,
        config
      )
      .then(response => {})
      .catch(error => {
        console.log(error);
      });

      console.log(this.state.item.status);
  }

  render() {
    return (
      <View>
        {this.props.isAuthenticated ? (
          <View>
            <Text/><Text/><Text/><Text/>
            <SellerLogout />
            {this.state.item ? (
              <View>
                 <Text/><Text/><Text/><Text/>
                <Text onPress={this.handleBack}>Go Back</Text>
                <Text> Item Details:</Text>
                <Text> category: {this.state.item.cat_id.name}</Text>
                <Text> subcategory: {this.state.item.sub_cat_id.name}</Text>
                <Text> quantity: {this.state.item.quantity} {this.state.item.sub_cat_id.quantity_type}</Text>
                
                {this.handleByStatus()}
              </View>
            ) : (
              <View>
                 <Text/><Text/><Text/><Text/>
                <Text>Here are all your items that are sold</Text>
                <View>
                  {this.state.items ? (
                    this.state.items.map(item => {
                      return (
                        <View key={item._id}>
                          <Text>category:{item.cat_id.name}</Text>
                          <Text> subcategory:{item.sub_cat_id.name}</Text>
                          <Text>
                            quantity:{item.quantity}
                            {item.sub_cat_id.quantity_type}
                          </Text>
                          <Button title="details" onPress={()=>{this.handleList(item)}}/>
                        </View>
                      );
                    })
                  ) : (
                    <Text>No Items to display</Text>
                  )}
                </View>
              </View>
            )}
            <View>
              <Text onPress={() => Actions.sellerNewItem()}>Add new Item</Text>
            </View>
          </View>
        ) : (
          <Text>Please Login First!</Text>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.sellerAuth.token,
  seller: state.sellerAuth.seller,
  isAuthenticated: state.sellerAuth.isAuthenticated,
  error: state.error
});

export default connect(mapStateToProps, { clearErrors })(ViewSelledItem);
