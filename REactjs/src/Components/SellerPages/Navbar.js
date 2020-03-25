import React from "react";
import SellerLogout from "./LogoutSeller";

export default function Navbar() {
	return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href="#">Seller</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/seller/profile">Profile</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/seller/newItem">Add Item for sale</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/seller/items">View all added items</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/seller/soldItems">View all sold items</a>
                        </li>
                    </ul>
                    <SellerLogout />
                </div>
            </nav>
        </div>
	);
}
