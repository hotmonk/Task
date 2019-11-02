var mongoose = require('mongoose');

var SelectionHandler = new mongoose.Schema({
    ///HANDLER ID OF ASSOCIATED ITEM
    vendor_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor"
    },
    ///PRICE OF CURRRENT VENDOR FOR CURRENT CATEGORY
    price: Number,
    ///ASSOCIATED SELECTION TABLE ENTRY
    selection_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Selection"
    },
    ///ASSOCIATED SUBCATEGORY ID
    subcat_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sub_cat"
    }
});

module.exports = mongoose.model("SelectionHandler", SelectionHandler);