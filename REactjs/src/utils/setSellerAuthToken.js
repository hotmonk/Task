import axios from 'axios';

const setAuthToken = (token)=>{
  if(token){
    // Apply to every request
    axios.defaults.headers.common['x-auth-seller-token'] = token;
  }else{
    // Delete Authorization header
    delete axios.defaults.headers.common['x-auth-seller-token'];
  }
}

export default setAuthToken;