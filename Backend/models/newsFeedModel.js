var mongoose = require('mongoose');

/// CUSTOMISED NEWS FEED OF ITEMS FOR EACH VENDOR
var News_feed = new mongoose.Schema({
    ///category id to which it belongs
    items:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    }],
    /// VENDOR ID
    vendor_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor"
    }
});

module.exports = mongoose.model("News_feed", News_feed);