var mongoose = require('mongoose');

var Vendor = new mongoose.Schema({
    name: String,
    email: String,
    contact: Number,
    address: String,
    password: String,
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