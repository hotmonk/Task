var mongoose = require('mongoose');

var Sub_cat = new mongoose.Schema({
    cat_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cat"
    },
    name: String,
    quantity_type: String,
    selectionHandle_id:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SelectionHandler"
    }]
});

module.exports = mongoose.model("Sub_cat", Sub_cat);