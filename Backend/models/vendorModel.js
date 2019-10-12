var mongoose = require('mongoose');

var Vendor = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
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
        required: true
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction"
        }
      ],
    location: String,
    requests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Request"
        }
      ]
});

module.exports = mongoose.model("Vendor", Vendor);