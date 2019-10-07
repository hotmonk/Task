import React from 'react';
import {Link} from 'react-router-dom';

function Options(){
  return (
    <div className="popup">
       <Link to='/profile'>Profile</Link>
       <h3>Current Transactions:</h3>
       <Link to='/transaction'>Read all enteries from database</Link>
       <h3>Previous Transactions:</h3>
       <h3>Add Transactions:</h3>
       <Link to='/add'><input type="submit" value="add"></input></Link>
    </div>
  );
}
export default Options;
