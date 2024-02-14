const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    totalAmount : Number,
    userId: String
});

module.exports = mongoose.model("address", addressSchema);