var mongoose = require('mongoose');

//Model to store vendor bids for an item
var Item_bid = new mongoose.Schema({
    ///category id to which it belongs
    item_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    },
    //vendor id of the vendors filtered by distance
    vendor_id:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor"
    }],

    //quote id by vendors who bidded for the item
    interested_vendor_id:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quote"
    }],

    // count of the number of vendors bidded (not exactly)
    counter:{
        type:Number,
        default:0
    }
});

module.exports = mongoose.model("Item_bid", Item_bid);