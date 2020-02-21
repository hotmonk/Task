import {
  SELLER_LOADED,
  SELLER_LOADING,
  SELLER_AUTH_ERROR,
  SELLER_LOGIN_SUCCESS,
  SELLER_LOGIN_FAIL,
  SELLER_LOGOUT_SUCCESS,
  SELLER_REGISTER_SUCCESS,
  SELLER_REGISTER_FAIL
} from '../actions/types';
import 'localstorage-polyfill';
import setAuthToken from '../utils/setSellerAuthToken'

const initialState = {
  token: localStorage.getItem('x-auth-seller-token'),
  isAuthenticated: null,
  isLoading: false,
  seller: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SELLER_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case SELLER_LOADED:
    setAuthToken(localStorage.getItem('x-auth-seller-token'));
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        seller: action.payload
      };
    case SELLER_LOGIN_SUCCESS:
    case SELLER_REGISTER_SUCCESS:
      localStorage.setItem('x-auth-seller-token', action.payload.token);
      setAuthToken(localStorage.getItem('x-auth-seller-token'));
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false
      };
    case SELLER_AUTH_ERROR:
    case SELLER_LOGIN_FAIL:
    case SELLER_LOGOUT_SUCCESS:
    case SELLER_REGISTER_FAIL:
      localStorage.removeItem('x-auth-seller-token');
      setAuthToken(null);
      return {
        ...state,
        token: null,
        seller: null,
        isAuthenticated: false,
        isLoading: false
      };
    default:
      return state;
  }
}
