var mongoose = require('mongoose');

var SelectionHandler = new mongoose.Schema({
    vendor_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor"
    },
    price: Number,
    selection_id:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Selection"
    }],
    subcat_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sub_cat"
    }
});

module.exports = mongoose.model("SelectionHandler", SelectionHandler);