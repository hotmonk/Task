var mongoose = require('mongoose');

var Item_bid = new mongoose.Schema({
    ///category id to which it belongs
    item_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    },
    vendor_id:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor"
    }],
    interested_vendor_id:[{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor"
        },
        price:Number
    }],
    counter:{
        type:Number,
        default:0
    }
});

module.exports = mongoose.model("Item_bid", Item_bid);