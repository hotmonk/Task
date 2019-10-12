var mongoose = require('mongoose');

var Item = new mongoose.Schema({
    cust_id: String,
    cat_id: String,
    sub_cat_id: String,
    quantity: Number,
    image: String,
    status: String,
});

module.exports = mongoose.model("Item", Item);