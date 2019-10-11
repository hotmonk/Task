var mongoose = require('mongoose');

var Sub_cat = new mongoose.Schema({
    name: String,
    quantity_type: String
});

module.exports = mongoose.model("Sub_cat", Sub_cat);