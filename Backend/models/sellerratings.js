var mongoose = require('mongoose');

var Sell_rat = new mongoose.Schema({
    cat_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller"
    },
    transaction: Number,
    cumulative_rating: Number,

});

module.exports = mongoose.model("Sell_rat", Sell_rat);