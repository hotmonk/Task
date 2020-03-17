var mongoose = require('mongoose');

/// dESTRUCTION LEVEL 100
var selection = new mongoose.Schema({
        ///VENDOR ID TO WHOM THE CURRENT TABLE BELONGS TO
    vendor_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor"
    },
    ///ALL THE SELECTION HANDLER ID BELONGING TO CURRENT VECTOR
    intake:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "SelectionHandler"
        }]
});

module.exports = mongoose.model("Selection", selection);