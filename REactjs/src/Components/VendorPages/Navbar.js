import React from "react";

export default function Navbar() {
	return (
		<div>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <a class="navbar-brand" href="#">Vendor</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="/vendor/profile">Profile</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/vendor/newsfeed">Items for sale</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/vendor/viewBuyedItems">Items purchased</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/vendor/newWasteType">Request for new category/subcategory </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/vendor/chooseCat">Choose category to quote</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/vendor/editPrice">Edit price</a>
                        </li>
                    </ul>
                    <button class="btn btn-outline-light my-2 my-sm-0"> Logout </button>
                </div>
            </nav>
        </div>
	);
}
