import React,{Component} from 'react';
import {Link} from 'react-router-dom';

class AcceptBid extends Component{
  render(){
  return (
    <div className="popup">
       <h1>Bid Details:</h1>
       <Link to='/profile'>Accept</Link>
       <input type="submit" value="Decline"></input>
    </div>
  );
}
}
export default AcceptBid;
