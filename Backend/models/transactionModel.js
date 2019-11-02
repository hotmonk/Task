var mongoose = require('mongoose');

var Transaction = new mongoose.Schema({
    ///SELLER ID INVILVED IN DEAL
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller"
    },
    ///VENDOR ID INVILVED IN DEAL
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor"
    },
    ///ITEM ID INVILVED IN DEAL
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    },
    ///PRICE QUOTED BY VENDOR
    price: Number,
    rating:Number
});

module.exports = mongoose.model("Transaction", Transaction);