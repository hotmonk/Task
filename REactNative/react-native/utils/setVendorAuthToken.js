import axios from 'axios';

const setAuthToken = (token)=>{
  if(token){
    // Apply to every request
    axios.defaults.headers.common['x-auth-vendor-token'] = token;
  }else{
    // Delete Authorization header
    delete axios.defaults.headers.common['x-auth-vendor-token'];
  }
}

export default setAuthToken;