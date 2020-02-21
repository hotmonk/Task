var mongoose = require('mongoose');

var Transaction = new mongoose.Schema({
    ///SELLER ID INVILVED IN DEAL
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller"
    },
    ///VENDOR ID INVOLVED IN DEAL
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor"
    },
    ///ITEM ID INVILVED IN DEAL
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    },
    order_id: String,
    ///PRICE QUOTED BY VENDOR
    price: Number,
    rating:Number,
    ///either COD or ONLINE
    method:String,
    status:{
        type:Boolean,
        Default: false
    }
});

module.exports = mongoose.model("Transaction", Transaction);