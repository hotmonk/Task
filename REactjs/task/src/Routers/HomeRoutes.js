import React from 'react';
import { Switch,Route } from 'react-router-dom';
import Login from '../Containers/Login.js';
import Options from '../Containers/selleroptions.js';
import Transactions from '../Containers/transactions.js';
import Profile from '../Containers/sellerprofile.js';
import Add from '../Containers/addItems.js';
import SignUpVendor from '../Components/SignUpVendor.js';
import SignUpSeller from '../Components/SignUpSeller.js';

const Routes =(props)=> {
        return(
                <Switch>
                    <Route path='/' exact component={Login} />
                    {/* <Route path='/home' exact component={SignUp} /> */}
                    <Route path='/options' exact component={Options} />
                    <Route path='/transaction' exact component={Transactions}/>
                    <Route path='/profile' exact component={Profile}/>
                    <Route path='/add' exact component={Add}/>
                    <Route path='/SignUpVendor' exact component={SignUpVendor}/>
                    <Route path='/SignUpSeller' exact component={SignUpSeller}/>
                </Switch>
        )

}

export default Routes;
