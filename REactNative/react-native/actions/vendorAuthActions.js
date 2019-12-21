import axios from 'axios';
import { returnErrors } from './errorActions';
import {baseURL} from '../config/constants.js';

import {
  VENDOR_LOADED,
  VENDOR_LOADING,
  VENDOR_AUTH_ERROR,
  VENDOR_LOGIN_SUCCESS,
  VENDOR_LOGIN_FAIL,
  VENDOR_LOGOUT_SUCCESS,
  VENDOR_REGISTER_SUCCESS,
  VENDOR_REGISTER_FAIL
} from './types';

export const tokenConfig = getState => {
  // Get token from localstorage
  const token = getState().vendorAuth.token;

  // Headers
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  // If token, add to headers
  if (token) {
    config.headers['x-auth-vendor-token'] = token;
  }

  return config;
};

// Check token & load user
export const loadVendor = () => (dispatch, getState) => {
  // User loading
  dispatch({ type: VENDOR_LOADING });

  axios
    .get(baseURL+'/vendor/login/vendor', tokenConfig(getState))
    .then(res =>
      dispatch({
        type: VENDOR_LOADED,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: VENDOR_AUTH_ERROR
      });
    });
};

// Register User
export const signupVendor = ({ name, email, contact, address, password,longitude,latitude }) => dispatch => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Request body
  const body = JSON.stringify({ name, email, contact, address, password,longitude,latitude });

  axios
    .post(baseURL+'/vendor/signUp', body, config)
    .then(res =>
      dispatch({
        type: VENDOR_REGISTER_SUCCESS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, 'VENDOR_REGISTER_FAIL')
      );
      dispatch({
        type: VENDOR_REGISTER_FAIL
      });
    });
};

// Login User
export const vendorLogin = ({ email, password }) => dispatch => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Request body
  const body = JSON.stringify({ email, password });

  axios
    .post(baseURL+'/vendor/login', body, config)
    .then(res =>
      dispatch({
        type: VENDOR_LOGIN_SUCCESS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, 'VENDOR_LOGIN_FAIL')
      );
      dispatch({
        type: VENDOR_LOGIN_FAIL
      });
    });
};

// Logout User
export const vendorLogout = () => {
  return {
    type: VENDOR_LOGOUT_SUCCESS
  };
};

// Setup config/headers and token

