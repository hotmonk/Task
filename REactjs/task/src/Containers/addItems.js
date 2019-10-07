import React,{Component} from 'react';
class Transaction extends Component{
  render(){
  return (
    <div className="popup">
      <h3>Item Name:</h3>
      <select>
          <option value="e">electronic</option>
          <option value="b">biodegradeable</option>
          <option value="p">plastic</option>
          <option value="n">non-biodegradeable</option>
      </select>
      <h3>Amount</h3>
      <input type="number" placeholder="0"></input>
      <select>
        <option value="kg">kg</option>
        <option value="l">liters</option>
        <option value="none"></option>
        <option value="m">meters</option>
      </select>
    </div>
  );
}
}
export default Transaction;
