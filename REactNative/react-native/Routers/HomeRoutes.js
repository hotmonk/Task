import React from 'react';
import { Router, Scene } from 'react-native-router-flux'
import LoginSeller from '../Components/SellerPages/LoginSeller';
import LoginVendor from '../Components/VendorPages/LoginVendor';
import SignUpSeller from '../Components/SellerPages/SignUpSeller';
import SignUpVendor from '../Components/VendorPages/SignUpVendor';
import ItemForm from '../Components/SellerPages/AddNewItem';
import vendorRequest from '../Components/VendorPages/requestVendor';
import vendorProfile from '../Components/VendorPages/ProfileVendor';
import sellerProfile from '../Components/SellerPages/ProfileSeller';
import newsFeed from '../Components/VendorPages/NewsFeed';
import ViewItem from '../Components/SellerPages/viewItemPage';

const Routes = (props) => {
        return(
          <Router>
            <Scene key = "root">
                <Scene key="vendorNewWasteType" component = { vendorRequest } title='NewWAsteTYpe' />
                <Scene key="sellerProfile" component = {sellerProfile} title='profile'/>
                <Scene key="vendorProfile" component = { vendorProfile } title='vendorProfile'/>
                <Scene key="sellerLogin"  component={ LoginSeller } title='loginseller'/>
                <Scene key="sellerSignUp" component={ SignUpSeller } title='SignupSeller'/>
                <Scene key="vendorLogin" component={ LoginVendor}  title='loginVendor' />
                <Scene key="vendorSignUp" component={ SignUpVendor } initial={true} title='SignUpVendor'/>
                <Scene key='sellerItems' component={ViewItem} title='sellerItems' />
                <Scene key='sellerNewItem' component={ItemForm} title='sellerNewItem'/>
                <Scene key='vendorNewsfeed' component={newsFeed} title='vendorNewsfeed'/>
                <Scene key='sellerAdditem' component={ItemForm} title='sellerAdditem'/>
             </Scene>
          </Router>
        );

}

export default Routes;
