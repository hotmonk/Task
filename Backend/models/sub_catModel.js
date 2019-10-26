var mongoose = require('mongoose');

var Sub_cat = new mongoose.Schema({
    cat_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cat"
    },
    name: String,
    quantity_type: String,
    selection_data:[{
        price:Number,
        selection_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Selection"
        }
    }]
});

module.exports = mongoose.model("Sub_cat", Sub_cat);