import React from 'react';

function SignUpSeller(){
  return (
    <div className="popup">
       <h3>Seller:</h3>
       <div>
         <label >Email address</label>
         <input type='email'
         placeholder="email"/>
       </div>
       <div>
         <label htmlFor='Name'>Name</label>
         <input type='name'
           placeholder='name' />
       </div>
       <div>
         <label >Password</label>
         <input type='password'
         placeholder="Password"/>
       </div>
       <div>
         <label htmlFor='Confirm'>Confirm Password</label>
         <input type='Confirm'
           placeholder='Confirm password'/>
       </div>
       <input class="Button" type="submit" value="Save"></input>
    </div>
  );
}
export default SignUpSeller;
