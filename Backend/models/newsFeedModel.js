var mongoose = require('mongoose');

var News_feed = new mongoose.Schema({
    ///category id to which it belongs
    items:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    }],
    vendor_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor"
    }
});

module.exports = mongoose.model("News_feed", News_feed);