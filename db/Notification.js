const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userName: String,
    name: String,
    operation: String,
    productId : String
});

module.exports = mongoose.model("notifications", notificationSchema);