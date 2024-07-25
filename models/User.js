const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const unlink = require('../unlink').unlink
const Post = require('./Post.js')
const Comment = require('./Comment.js')
const Chat = require('./Chat.js');
const { socketStore_not } = require('../socketStore.js');
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  country: {
    type: String
  },
  profilePicture: {
    type: String
  },
  bio: {
    type: String
  },
  hobbies: [{
    type: String
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  followings: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  notification: [{
    who: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
  }],
  likeposts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  likecmts: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  chats: [{
    with: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: 'Chat'
    }
  }]
});


userSchema.methods.updateProfile = async function(data, files) {
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = file.path;
    if(this.profilePicture){
      unlink(this.profilePicture)
    }
    this.profilePicture = path;
  }
  this.name = data.name;
  this.email = data.email;
  this.birthday = data.birthday ? new Date(data.birthday) : null;
  this.gender = data.gender;
  this.address = data.address;
  this.city = data.city;
  this.country = data.country;
  this.bio = data.bio;
};
userSchema.methods.getProfileData = async function (username, update) {
  const user_query = await this.constructor.findOne({ name: username });
  let check = false;

  const user_comments = {};
  const comments = {};
  const posts = [];
  let followed = false;

  for (let id of this.followings) {
    if (id.equals(user_query._id)) {
      followed = true;
    }
  }

  await this.populate({
    path: 'notification.who',
    select: 'name profilePicture'
  });

  if (this.name === user_query.name) {
    for (const postId of this.posts) {
      const post = await Post.findById(postId);
      posts.push(post);
      for (const commentId of post.comments) {
        const comment = await Comment.findById(commentId);
        const user_cmt = await this.constructor.findById(comment.user);
        comments[commentId] = comment;
        user_comments[commentId] = user_cmt;
      }
    }
    check = true;
  } else {
    for (const postId of user_query.posts) {
      const post = await Post.findById(postId);
      posts.push(post);
      for (const commentId of post.comments) {
        const comment = await Comment.findById(commentId);
        const user_cmt = await this.constructor.findById(comment.user);
        comments[commentId] = comment;
        user_comments[commentId] = user_cmt;
      }
    }
  }

  const chats = {};
  for (let i = 0; i < this.chats.length; i++) {
    let chat = await Chat.findById(this.chats[i].chat);
    if (chat) {
      await chat.populate([
        {
          path: 'user',
          select: 'name profilePicture'
        },
        {
          path: 'contents.author',
          select: 'name profilePicture'
        }
      ]);
    }
    chats[chat._id] = chat;
  }

  await this.populate([
    {
      path: 'notification.who',
      select: 'name profilePicture'
    },
    {
      path: 'chats.with',
      select: 'name profilePicture'
    }
  ]);

  return { chats, check, followed, user: this, user_query, update, posts, comments, user_comments };
};



userSchema.methods.getInformation = async function (update) {
  const chats = {};

  for (let i = 0; i < this.chats.length; i++) {
    let chat = await Chat.findById(this.chats[i].chat);
    if (chat) {
      await chat.populate([
        {
          path: 'user',
          select: 'name profilePicture'
        },
        {
          path: 'contents.author',
          select: 'name profilePicture'
        }
      ]);
    }
    chats[chat._id] = chat;
  }

  await this.populate([
    {
      path: 'notification.who',
      select: 'name profilePicture'
    },
    {
      path: 'chats.with',
      select: 'name profilePicture'
    }
  ]);

  return { chats, user: this, update };
};
// userSchema.methods.getPostData = async function (postId) {
//   try {
//     const post = await Post.findById(postId);
//     const user_comments = {};
//     const comments = {};

//     for (const commentId of post.comments) {
//       const comment = await Comment.findById(commentId);
//       comments[commentId] = comment;
//       const u = await this.constructor.findById(comment.user);
//       user_comments[commentId] = u;
//     }

//     await this.populate({
//       path: 'notification.who',
//       select: 'name profilePicture'
//     });

//     return { user_comments, comments, post };
//   } catch (error) {
//     throw error;
//   }
// };


userSchema.methods.createPost = async function (content, location, visibility, files) {
  try {
    const newPost = new Post({
      content,
      author: this._id,
      location,
      visibility,
    });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const path = file.path;
      const newMedia = {
        url: path
      };
      newPost.media.push(newMedia);
    }

    await newPost.save();
    this.posts.push(newPost._id);
    await this.save();

    return newPost;
  } catch (err) {
    throw err;
  }
};
// Method to delete a post
userSchema.methods.deletePost = async function (postId) {
  const post = await Post.findById(postId);
  for (let i = 0; i < post.media.length;i++){
    unlink(post.media[i].url)
  }
  if (!post.author.equals(this._id)) {
      throw new Error('Unauthorized');
  }

  // Xóa bài viết khỏi danh sách bài viết của người dùng hiện tại
  this.posts.pull(post._id);
  await this.save();

  // Xóa bài viết khỏi danh sách likeposts của tất cả người dùng
  const usersWhoLiked = await this.constructor.find({ likeposts: post._id });
  for (const user of usersWhoLiked) {
      user.likeposts.pull(post._id);
      await user.save();
  }

  // Xóa bài viết khỏi danh sách comments của tất cả người dùng
  const usersWhoCommented = await this.constructor.find({ comments: { $in: post.comments } });
  for (const user of usersWhoCommented) {
      user.comments = user.comments.filter(commentId => !post.comments.includes(commentId));
      await user.save();
  }

  // Xóa các bình luận liên quan đến bài viết
  await Comment.deleteMany({ _id: { $in: post.comments } });

  // Xóa bài viết
  await Post.deleteOne({ _id: postId });
  
  return post;
};

// Method to update a post
userSchema.methods.updatePost = async function (postId, content, location, status, visibility, tags, file) {
  const post = await Post.findById(postId);

  if (post.author.toString() !== this._id.toString()) {
    throw new Error('Unauthorized');
  }

  post.content = content;
  post.location = location;
  post.status = status;
  post.visibility = visibility;
  post.tags = tags.split(',').map(tag => tag.trim());

  if (file) {
    post.media = [{
      url: '/uploads/' + file.filename,
      type: 'image'
    }];
  }

  await post.save();

  return post;
};

// Method to like or unlike a post
userSchema.methods.likePost = async function (postId, io) {
  const post = await Post.findById(postId);

  if (post.likes.includes(this._id)) {
    post.likes.pull(this._id);
    this.likeposts.pull(post._id);
    await post.save();
    await this.save();
    io.getIO().emit('post', post);
    return { message: 'Unliked the post', liked: false };
  }

  post.likes.push(this._id);
  this.likeposts.push(post._id);
  await post.save();
  await this.save();

  const postAuthor = await this.constructor.findById(post.author);
  if (postAuthor._id.toString() !== this._id.toString()) {
    postAuthor.notification.push({
      who: this._id,
      content: this.name + " đã thích bài viết của bạn",
      post: post._id
    });
    await postAuthor.save();
  }

  io.getIO().emit('post', post);
  return { message: 'Liked the post', liked: true };
};


userSchema.methods.commentOnPost = async function (postId, content) {
  const post = await Post.findById(postId);
  const comment = new Comment({ user: this._id, content });
  await comment.save();

  this.comments.push(comment._id);
  post.comments.push(comment._id);
  await post.save();

  const postAuthor = await this.constructor.findById(post.author);
  if (postAuthor._id.toString() !== this._id.toString()) {
    postAuthor.notification.push({
      who: this._id,
      content: this.name + " đã bình luận bài viết của bạn",
      post: post._id,
      comment: comment._id
    });
    await postAuthor.save();
  }

  return comment;
};

// Method to follow or unfollow a user
userSchema.methods.followUser = async function (username,io) {
  const userToFollow = await this.constructor.findOne({ name: username });

  if (!userToFollow) {
    throw new Error('User not found');
  }

  const alreadyFollowing = this.followings.some(id => id.equals(userToFollow._id));
  if (alreadyFollowing) {
    this.followings.pull(userToFollow._id);
    userToFollow.followers.pull(this._id);
  } else {
    this.followings.push(userToFollow._id);
    userToFollow.followers.push(this._id);
    userToFollow.notification.push({
      who: this._id,
      content: this.name + " đã follow bạn"
    });
    const socketId = socketStore_not.sockets[userToFollow._id];
    if (socketId) {
      io.getIO().to(socketId).emit('follow', {name: this.name,date: Date.now});
    } else {
      console.log(`Không tìm thấy socket ID cho user ${userToFollow._id}`);
    }
  }
  
  await this.save();
  await userToFollow.save();

  return userToFollow;
};



// Method to get user data for the main page
userSchema.methods.getMainData = async function () {
  const users = { [this._id]: this };
  const posts = {};
  const comments = {};
  const user_comments = {};

  for (const userId of this.followings) {
    const userFollowing = await this.constructor.findById(userId);
    users[userId] = userFollowing;
  }

  for (const key in users) {
    posts[key] = [];
    for (const postId of users[key].posts) {
      const post = await Post.findById(postId);
      if (post) {
        for (const commentId of post.comments) {
          const comment = await Comment.findById(commentId);
          const user_cmt = await this.constructor.findById(comment.user);
          comments[commentId] = comment;
          user_comments[commentId] = user_cmt;
        }
        await post.populate({
          path: 'author',
          select: 'name'
        });
        posts[key].push(post);
      }
    }
  }

  return { users, posts, comments, user_comments };
};

// Method to get user's chats data
userSchema.methods.getChatsData = async function () {
  const chats = {};

  for (let i = 0; i < this.chats.length; i++) {
    const chat = await Chat.findById(this.chats[i].chat);
    if (chat) {
      await chat.populate([
        {
          path: 'user',
          select: 'name profilePicture'
        },
        {
          path: 'contents.author',
          select: 'name profilePicture'
        }
      ]);

      chats[chat._id] = chat;
    }
  }

  return chats;
};
module.exports = mongoose.model('User', userSchema);