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
import ViewSelledItem from '../Components/SellerPages/SoldItems';
import ViewBuyedItem from '../Components/VendorPages/BuyedItems';
import chooseCat from '../Components/VendorPages/choose_cat';
import editPrice from '../Components/VendorPages/editPrice';
import Payment from '../Components/VendorPages/Payment';

const Routes = (props) => {
        return(
          <Router>
            <Scene key = "root">
                <Scene key="vendorNewWasteType" component = { vendorRequest } title='NewWAsteTYpe' />
                <Scene key="sellerProfile" component = {sellerProfile} title='profile'/>
                <Scene key="vendorProfile" component = { vendorProfile } title='vendorProfile'/>
                <Scene key="sellerLogin"  component={ LoginSeller } title='loginseller'/>
                <Scene key="sellerSignUp" component={ SignUpSeller } initial={true} title='SignupSeller'/>
                <Scene key="vendorLogin" component={ LoginVendor}  title='loginVendor' />
                <Scene key="vendorSignUp" component={ SignUpVendor }  title='SignUpVendor'/>
                <Scene key='sellerItems' component={ViewItem} title='sellerItems' />
                <Scene key='sellerNewItem' component={ItemForm} title='sellerNewItem'/>
                <Scene key='vendorNewsfeed' component={newsFeed} title='vendorNewsfeed'/>
                <Scene key='sellerAdditem' component={ItemForm} title='sellerAdditem'/>
                <Scene key='sellerSoldItems' component={ViewSelledItem} title='sellerSoldItems'/>
                <Scene key='vendorViewBuyedItems' component={ViewBuyedItem} title='vendorViewBuyedItems'/>
                <Scene key='vendorEditPrice' component={editPrice} title='vendorEditPrice'/>
                <Scene key='vendorChooseCat' component={chooseCat} title='vendorChooseCat'/>
                <Scene key='vendorPayments' component={Payment} title='vendorPayments'/>
             </Scene>
          </Router>
        );

}

export default Routes;
