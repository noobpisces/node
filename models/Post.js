const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const User = require('./User');
const Comment = require('./Comment')
const postSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  location: {
    type: String
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'friends'],
    default: 'public'
  },
  media: [{
    url: {
      type: String
    },
    type: {
      type: String,
      enum: ['image', 'video'],
      default: 'image'
    }
  }],
  tags: [{
    type: String
  }]
});

postSchema.methods.getPostData = async function () {
  try {
    const User = require('./User');
    const Comment = require('./Comment')
    //const post = await this.constructor.findById(this._id);
    const user_comments = {};
    const comments = {};

    for (const commentId of this.comments) {
      const comment = await Comment.findById(commentId);
      comments[commentId] = comment;
      const u = await User.findById(comment.user);
      user_comments[commentId] = u;
    }



    return { user_comments, comments, post: this };
  } catch (error) {
    throw error;
  }
};
// postSchema.methods.updatePost = async function (content, location, visibility, files,deleteFilesArray ) {
//   try {
//     this.content = content;
//     this.location = location;
//     this.visibility = visibility;
//     for (let i = 0;i< files.length;i++){
//       const newMedia = {
//         url: files[i]
//       };
//       this.media.push(newMedia)
//     }
//     return true
//   } catch(error) {
//     throw error
//   }
// }
module.exports = mongoose.model('Post', postSchema);