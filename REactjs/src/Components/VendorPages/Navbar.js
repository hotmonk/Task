import React from "react";
import VendorLogout from './LogoutVendor';

export default function Navbar() {
	return (
		<div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href="#">Vendor</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/vendor/profile">Profile</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/vendor/newsfeed">Items for sale</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/vendor/viewBuyedItems">Items purchased</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/vendor/newWasteType">Request for new category/subcategory </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/vendor/chooseCat">Choose category to quote</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/vendor/editPrice">Edit price</a>
                        </li>
                    </ul>
                    <VendorLogout />
                </div>
            </nav>
        </div>
	);
}
