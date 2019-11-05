import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import sellerAuthReducer from './sellerAuthReducer';
import vendorAuthReducer from './vendorAuthReducer';

export default combineReducers({
  error: errorReducer,
  sellerAuth: sellerAuthReducer,
  vendorAuth: vendorAuthReducer
});
