var mongoose = require('mongoose');

var collectionSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    pr: Number,
    qty: Number,
    category: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

module.exports = mongoose.model('Collection', collectionSchema);