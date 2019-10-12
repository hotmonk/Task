import React from 'react';
import { Switch,Route } from 'react-router-dom';

import LoginSeller from '../Components/SellerPages/LoginSeller';
import LoginVendor from '../Components/VendorPages/LoginVendor';
import SignUpSeller from '../Components/SellerPages/SignUpSeller';
import SignUpVendor from '../Components/VendorPages/SignUpVendor';

const Routes = (props) => {
        return(
             <Switch>
                <Route path='/vendor/signUp' exact component={SignUpVendor}/>
                <Route path='/seller/signUp' exact component={SignUpSeller}/>
                <Route path='/vendor/login' exact component={LoginVendor}/>
                <Route path='/seller/login' exact component={LoginSeller}/>
             </Switch>
        )

}

export default Routes;
