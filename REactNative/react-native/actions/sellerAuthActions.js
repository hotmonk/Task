import axios from 'axios';
import { returnErrors } from './errorActions';
import {baseURL} from '../config/constants.js';

import {
  SELLER_LOADED,
  SELLER_LOADING,
  SELLER_AUTH_ERROR,
  SELLER_LOGIN_SUCCESS,
  SELLER_LOGIN_FAIL,
  SELLER_LOGOUT_SUCCESS,
  SELLER_REGISTER_SUCCESS,
  SELLER_REGISTER_FAIL
} from './types';

export const tokenConfig = getState => {
  // Get token from localstorage
  const token = getState().sellerAuth.token;

  // Headers
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  // If token, add to headers
  if (token) {
    config.headers['x-auth-seller-token'] = token;
  }

  return config;
};

// Check token & load user
export const loadSeller = () => (dispatch, getState) => {
  // User loading
  dispatch({ type: SELLER_LOADING });

  axios
    .get(baseURL+'/seller/login/seller', tokenConfig(getState))
    .then(res =>
      dispatch({
        type: SELLER_LOADED,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: SELLER_AUTH_ERROR
      });
    });
};

// Register User
export const signupSeller = ({ name, email, contact, address, password,latitude,longitude }) => dispatch => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Request body
  const body = JSON.stringify({ name, email, contact, address, password,latitude,longitude });

  axios
    .post(baseURL+'/seller/signUp', body, config)
    .then(res =>
      dispatch({
        type: SELLER_REGISTER_SUCCESS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, 'SELLER_REGISTER_FAIL')
      );
      dispatch({
        type: SELLER_REGISTER_FAIL
      });
    });
};

// Login User
export const sellerLogin = ({ email, password }) => dispatch => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Request body
  const body = JSON.stringify({ email, password });

  axios
    .post(baseURL+'/seller/login', body, config)
    .then(res =>
      dispatch({
        type: SELLER_LOGIN_SUCCESS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, 'SELLER_LOGIN_FAIL')
      );
      dispatch({
        type: SELLER_LOGIN_FAIL
      });
    });
};

// Logout User
export const sellerLogout = () => {
  return {
    type: SELLER_LOGOUT_SUCCESS
  };
};

