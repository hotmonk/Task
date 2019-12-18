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
    }]
});

module.exports = mongoose.model("Item_bid", Item_bid);