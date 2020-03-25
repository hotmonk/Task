var mongoose = require('mongoose');

var Sub_cat = new mongoose.Schema({
    ///category id to which it belongs
    cat_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cat"
    },
    ///NAME OF THE SUB CATEGORY
    name:{
        type:String,
        lowercase:true
    } ,
    ///QUANTITY TYPE CAN BE KG,G,ML,L,MG,PER PIECE
    quantity_type: String,
    /// SELECTION ID OF ALL THE BIDS
    selectionHandle_id:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SelectionHandler"
    }]
});

module.exports = mongoose.model("Sub_cat", Sub_cat);