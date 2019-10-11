import React,{Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';


class Profile extends Component{
  render(){
    return (
      <div className="profile">
        <h1>Name:</h1>
        <h1>Address:</h1>
        <h1>Contact Number:</h1>
      </div>
    );
  }
}


const mapStateToProps =state=>{
  return {
    id:state.id
  };
};


export default connect(mapStateToProps)(SignUpSeller);
export default Profile;
