import React,{Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';


class Profile extends Component{
  render(){
    return (
      <div className="profile">
        <h1>Name: ABCD</h1>
        <h1>Address: yuewfb gdshbc kcbhdvc</h1>
        <h1>Contact Number: 73868847296</h1>
      </div>
    );
  }
}


const mapStateToProps =state=>{
  return {
    id:state.id
  };
};

export default Profile;
