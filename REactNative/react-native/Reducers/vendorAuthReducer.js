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
import 'localstorage-polyfill';
import setAuthToken from '../utils/setVendorAuthToken'

const initialState = {
  token: localStorage.getItem('x-auth-vendor-token'),
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
    setAuthToken(localStorage.getItem('x-auth-vendor-token'));
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        vendor: action.payload
      };
    case VENDOR_LOGIN_SUCCESS:
    case VENDOR_REGISTER_SUCCESS:
      localStorage.setItem('x-auth-vendor-token', action.payload.token);
      setAuthToken(localStorage.getItem('x-auth-vendor-token'));
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
      localStorage.removeItem('x-auth-vendor-token');
      setAuthToken(null);
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
