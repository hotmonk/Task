var mongoose = require('mongoose');

var Quote = new mongoose.Schema({
    vendor_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor"
    },
    price:Number
});

module.exports = mongoose.model("Quote", Quote);