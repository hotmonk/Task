import {
    VENDOR_LOADED,
    VENDOR_LOADING,
    VENDOR_AUTH_ERROR,
    VENDOR_LOGIN_SUCCESS,
    VENDOR_LOGIN_FAIL,
    VENDOR_LOGOUT_SUCCESS,
    VENDOR_REGISTER_SUCCESS,
    VENDOR_REGISTER_FAIL
  } from '../actions/types';
  
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    vendor: null
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case VENDOR_LOADING:
        return {
          ...state,
          isLoading: true
        };
      case VENDOR_LOADED:
        return {
          ...state,
          isAuthenticated: true,
          isLoading: false,
          vendor: action.payload
        };
      case VENDOR_LOGIN_SUCCESS:
      case VENDOR_REGISTER_SUCCESS:
        localStorage.setItem('token', action.payload.token);
        return {
          ...state,
          ...action.payload,
          isAuthenticated: true,
          isLoading: false
        };
      case VENDOR_AUTH_ERROR:
      case VENDOR_LOGIN_FAIL:
      case VENDOR_LOGOUT_SUCCESS:
      case VENDOR_REGISTER_FAIL:
        localStorage.removeItem('token');
        return {
          ...state,
          token: null,
          vendor: null,
          isAuthenticated: false,
          isLoading: false
        };
      default:
        return state;
    }
  }
  