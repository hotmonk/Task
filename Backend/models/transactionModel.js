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
    ///ITEM ID INVOLVED IN DEAL
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    },
    /// ORDER ID recieved during paytm callback
    order_id: String,
    ///quantity of the item taken by the vendor
    quantity_taken: Number,
    ///reason why less quantity of the item is taken by vendor
    reason:String,
    ///PRICE QUOTED BY VENDOR
    price: Number,
    rating:Number,
    ///EITHER COD OR ONLINE
    method:String,
    /// STATUS OF THE PAYMENT
    status:{
        type:Boolean,
        Default: true
    }
});

module.exports = mongoose.model("Transaction", Transaction);