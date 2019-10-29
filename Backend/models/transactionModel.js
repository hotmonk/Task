var mongoose = require('mongoose');

var Transaction = new mongoose.Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor"
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    },
    price: Number,
    rating:Number
});

module.exports = mongoose.model("Transaction", Transaction);