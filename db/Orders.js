const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    name: String,
    category: String,
    company: String,
    price : Number,
    userName: String
});

module.exports = mongoose.model("orders", ordersSchema);