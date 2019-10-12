var mongoose = require('mongoose');

var Seller = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
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
        required: true
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
        }
      ],
    location: String,
});

module.exports = mongoose.model("Seller", Seller);