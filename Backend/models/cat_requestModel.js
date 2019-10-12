var mongoose = require('mongoose');

var Cat_request = new mongoose.Schema({
    vendor_id: String,
    cat_name: String,
    sub_cat_name: String,
    quantity_type: String,
    status: String
});

module.exports = mongoose.model("Cat_request", Cat_request);