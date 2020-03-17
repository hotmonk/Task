var mongoose = require('mongoose');

/// MODEL TO ADD QUOTATIONS OF EACH VENDOR FOR EACH ITEM
var Quote = new mongoose.Schema({
    /// VENDOR ID OF THE VENDOR QUOTING
    vendor_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor"
    },
    /// PRICE OF THE ITEM QUOTED BY VENDOR
    price:Number,
    /// APPROX DATA OF THE VENDOR TO COLLECT ITEM
    date:String,
    /// APPROX TIME OF THE VENDOR TO COLLECT ITEM
    time:String
});

module.exports = mongoose.model("Quote", Quote);