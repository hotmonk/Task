var mongoose = require('mongoose');

var Seller = new mongoose.Schema({
    name: String,
    email: String,
    contact: Number,
    address: String,
    password: String,
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
        }
      ],
    location: String
});

module.exports = mongoose.model("Seller", Seller);