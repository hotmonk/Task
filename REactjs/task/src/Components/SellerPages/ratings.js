import React, { Component } from 'react';
import Rating from 'react-rating';

export class SellerLogout extends Component {
    constructor(props) {
        super(props);
        this.state = {value: 0};
    
        this.handleClick = this.handleClick.bind(this);
      }
    
      handleClick(event) {
        console.log(this.state.value);
        this.setState({value: undefined});
      }
    
  render() {
    return (
      <div>
         <h1>RATINGS</h1>   
         <Rating {...this.props}
           emptySymbol="fa fa-star-o fa-2x"
           fullSymbol="fa fa-star fa-2x"
          initialRating={this.state.value} />
         <button onClick={this.handleClick}>Submit</button>
      </div>
    );
  }
}
