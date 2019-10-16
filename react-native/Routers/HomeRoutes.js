import React from 'react';
import { Router, Scene } from 'react-native-router-flux'
import sellerProfile from '../Components/SellerPages/ProfileSeller';
import vendorProfile from '../Components/VendorPages/ProfileVendor';
import vendorRequest from '../Components/VendorPages/requestVendor';
import SellerLogin from '../Components/SellerPages/LoginSeller';
import SellerSignup from '../Components/SellerPages/SignUpSeller'
import VendorLogin from '../Components/VendorPages/LoginVendor';
import VendorSignup from '../Components/VendorPages/SignUpVendor';

const Routes = (props) => {
        return(
          <Router>
            <Scene key = "root">
                <Scene key="vendorNewWasteType" component = { vendorRequest } title='NewWAsteTYpe' />
                <Scene key="sellerProfile" component = {sellerProfile} title='profile'/>
                <Scene key="vendorProfile" component = { vendorProfile } title='vendorProfile'/>
                <Scene key="sellerLogin"  component={ SellerLogin } title='loginseller'/>
                <Scene key="sellerSignUp" component={ SellerSignup } initial={true} title='SignupSeller'/>
                <Scene key="vendorLogin" component={ VendorLogin } title='loginVendor' />
                <Scene key="vendorSignUp" component={ VendorSignup } title='SignUpVendor'/>
             </Scene>
          </Router>
        );

}

export default Routes;
