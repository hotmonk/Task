import React from 'react';
import { Switch,Route } from 'react-router-dom';

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
import Ratings from '../Components/SellerPages/ratings';
import Seller_Rate from '../Components/SellerPages/rate_transactions';

const Routes = (props) => {
        return(
             <Switch>
                <Route path='/vendor/signUp' exact component={SignUpVendor}/>
                <Route path='/seller/signUp' exact component={SignUpSeller}/>
                <Route path='/vendor/login' exact component={LoginVendor}/>
                <Route path='/seller/login' exact component={LoginSeller}/>
                <Route path='/vendor/newWasteType' exact component={vendorRequest} />
                <Route path='/seller/ratings' component={Ratings}/>
                <Route path='/seller/rate' component={Seller_Rate}/>
                <Route path='/seller/items' component={ViewItem}/>
                <Route path='/seller/newItem' component={ItemForm}/>
                <Route path='/seller/profile' component={sellerProfile}/>
                <Route path='/vendor/profile' component={vendorProfile}/>
                <Route path='/vendor/newsfeed' component={newsFeed}/>
                <Route path='/seller/additem' component={ItemForm}/>
                <Route path='/seller/soldItems' component={ViewSelledItem}/>
                <Route path='/vendor/viewBuyedItems' component={ViewBuyedItem}/>
             </Switch>
        )

}

export default Routes;
