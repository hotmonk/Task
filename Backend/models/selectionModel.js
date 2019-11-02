var mongoose = require('mongoose');

var selection = new mongoose.Schema({
    vendor_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor"
    },
    intake:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "SelectionHandler"
        }]
});

module.exports = mongoose.model("Selection", selection);