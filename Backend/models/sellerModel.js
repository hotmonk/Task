var mongoose = require('mongoose');

/// MODEL TO STORE SELLER DATA TO THE DATABASE
var Seller = new mongoose.Schema({
    //NAME OF VENDOR
    name: {
        type: String,
        required: true
    },
    ///EMAIL OF VENDOR
    email: {
        type: String,
        required: true,
        unique:true,
        lowercase:true
    },
    ///CONTACT NUMBER OF VENDOR
    contact: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength:8
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
        }
      ],

    ///to store coordinates of seller
    latitude:Number,
    longitude:Number
});

module.exports = mongoose.model("Seller", Seller);