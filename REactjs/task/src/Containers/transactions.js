import React,{Component} from 'react';


class Transaction extends Component{
  render(){
  return (
    <div className="popup">
       <h1>Item:</h1>
       <h1>Bid by:</h1>
       <h1>Bid Amount:</h1>
       <input type="submit" value="Collect Receipt"></input>
    </div>
  );
}
}
export default Transaction;
