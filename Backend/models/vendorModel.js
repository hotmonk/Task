var mongoose = require('mongoose');

var Vendor = new mongoose.Schema({
    ///name of vendor
    name: {
        type: String,
        required: true
    },
    ///email id of vendor
    email: {
        type: String,
        required: true,
        unique:true,
        lowercase:true
    },
    ///contact no of vendor
    contact: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength:8
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction"
        }
    ],
    newsFeed:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "News_feed"
    },
    requests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Request"
        }
    ],
    selection_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Selection"
    },
    ///LOCATION COORDINATES OF VENDOR
    latitude:Number,
    longitude:Number,
    defaulter:Boolean,
    defaulterAmount:Number
});

module.exports = mongoose.model("Vendor", Vendor);