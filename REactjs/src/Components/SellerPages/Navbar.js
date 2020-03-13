import React from "react";

export default function Navbar() {
	return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <a class="navbar-brand" href="#">Seller</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="/seller/profile">Profile</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/seller/newItem">Add Item for sale</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/seller/items">View all added items</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/seller/soldItems">View all sold items</a>
                        </li>
                    </ul>
                    <button class="btn btn-outline-light my-2 my-sm-0"> Logout </button>
                </div>
            </nav>
        </div>
	);
}
