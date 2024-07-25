const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    replies: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }]
  });
  

module.exports = mongoose.model('Comment', commentSchema);