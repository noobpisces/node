const User = require('../models/User');
const Post = require('../models/Post');
const Chat = require('../models/Chat');
const io = require("../socket")
const socketStore = require('../socketStore')
const Comment = require('../models/Comment');
const { validationResult } = require('express-validator');

const unlink = require('../unlink').unlink
 


// exports.getProfile = async (req, res, next) => {
//     const user = req.session.user;
//     const username = req.query.username;
//     var user_query = await User.findOne({ name: username })
//     const update = req.query.update === 'true'; // Check if query parameter 'update' is set to 'true'
//     var check = false;

//     const user_comments = {};
//     const comments = {};
//     const posts = [];
//     var followed = false;
//     for (id of user.followings) {
//         if (id.equals(user_query._id)) {
//             followed = true;

//         }
//     }
//     await user.populate({
//         path: 'notification.who',
//         select: 'name profilePicture'
//     })
//     if (user.name === user_query.name) {
//         for (const postId of user.posts) {
//             const post = await Post.findById(postId);
//             posts.push(post);
//             for (const commentId of post.comments) {

//                 const comment = await Comment.findById(commentId);
//                 const user_cmt = await User.findById(comment.user)
//                 comments[commentId] = comment;
//                 user_comments[commentId] = user_cmt;
//             }
//         }
//         check = true;
//         const chats = {}
//         for (i = 0; i < user.chats.length; i++) {
//             let chat = await Chat.findById(user.chats[i].chat)
//             if (chat) {
//                 await chat.populate([
//                     {
//                         path: 'user',
//                         select: 'name profilePicture'
//                     },
//                     {
//                         path: 'contents.author',
//                         select: 'name profilePicture'
//                     }
//                 ])
//             }
//             chats[chat._id] = chat
//         }
//         await user.populate([
//             {
//                 path: 'notification.who',
//                 select: 'name profilePicture'
//             },
//             {
//                 path: 'chats.with',
//                 select: 'name profilePicture'
//             }
//         ])

//         res.render('info/profile', { chats: chats, check, followed, user, user_query, update, posts: posts, comments: comments, user_comments: user_comments });
//     } else {
//         for (const postId of user_query.posts) {
//             const post = await Post.findById(postId);
//             posts.push(post);
//             for (const commentId of post.comments) {

//                 const comment = await Comment.findById(commentId);
//                 const user_cmt = await User.findById(comment.user)
//                 comments[commentId] = comment;
//                 user_comments[commentId] = user_cmt;
//             }
//         }
//         const chats = {}
//         for (i = 0; i < user.chats.length; i++) {
//             let chat = await Chat.findById(user.chats[i].chat)
//             if (chat) {
//                 await chat.populate([
//                     {
//                         path: 'user',
//                         select: 'name profilePicture'
//                     },
//                     {
//                         path: 'contents.author',
//                         select: 'name profilePicture'
//                     }
//                 ])
//             }
//             chats[chat._id] = chat
//         }
//         await user.populate([
//             {
//                 path: 'notification.who',
//                 select: 'name profilePicture'
//             },
//             {
//                 path: 'chats.with',
//                 select: 'name profilePicture'
//             }
//         ])
//         res.render('info/profile', { chats: chats, check, followed, user, user_query, update, posts: posts, comments: comments, user_comments: user_comments });
//     }
// }
exports.getProfile = async (req, res, next) => {
    const user = req.session.user;
    const username = req.query.username;
    const update = req.query.update === 'true';

    try {
        const profileData = await user.getProfileData(username, update);
        res.render('info/profile', profileData);
    } catch (err) {
        next(err);
    }
};
// exports.getInfomation = async (req, res, next) => {
//     const user = req.session.user;
//     const update = req.query.update === 'true'; // Check if query parameter 'update' is set to 'true'
//     const chats = {}
//     for (i = 0; i < user.chats.length; i++) {
//         let chat = await Chat.findById(user.chats[i].chat)
//         if (chat) {
//             await chat.populate([
//                 {
//                     path: 'user',
//                     select: 'name profilePicture'
//                 },
//                 {
//                     path: 'contents.author',
//                     select: 'name profilePicture'
//                 }
//             ])
//         }
//         chats[chat._id] = chat
//     }
//     await user.populate([
//         {
//             path: 'notification.who',
//             select: 'name profilePicture'
//         },
//         {
//             path: 'chats.with',
//             select: 'name profilePicture'
//         }
//     ])
//     res.render('info/infomation', { chats, user, update });
// }


exports.getInfomation = async (req, res, next) => {
    const user = req.session.user;
    const update = req.query.update === 'true';

    try {
        const infomationData = await user.getInformation(update);
        console.log('tuấn ')
        res.render('info/infomation', infomationData);
    } catch (err) {
        console.log(err)
    }
};
exports.postInfomation = async (req, res, next) => {
    try {
        var user = await User.findById(req.session.user._id);
        var files = req.files;
        await user.updateProfile(req.body, req.files);
        await user.save()
        req.session.user = user
        res.redirect('/infomation')
    } catch (err) {
        console.log(err)
        next(err);
    }
}



exports.getPost = async (req, res, next) => {
    try {
        const update = req.query.update
        const postId = req.query.post_Id;
        const user = await User.findById(req.session.user._id);
        const post = await Post.findById(postId)
        const postData = await post.getPostData();
        const chats = await user.getChatsData()
        await user.populate({
            path: 'notification.who',
            select: 'name profilePicture'
        });
        if (!update) {
            res.render('info/post-detail', {
                update: false,
                user,
                user_comments: postData.user_comments,
                user_query: user,
                comments: postData.comments,
                post: postData.post,
                chats: chats
            });
        } else {
            res.render('info/post-detail', {
                update: true,
                user,
                user_comments: postData.user_comments,
                user_query: user,
                comments: postData.comments,
                post: postData.post,
                chats: chats
            });
        }

    } catch (err) {
        next(err);
    }
};
// exports.postPost = async (req, res, next) => {
//     try {
//         const { content, location, visibility } = req.body;
//         const newPost = new Post({
//             content,
//             author: req.session.user._id,
//             location,
//             visibility,
//         });
//         var files = req.files;
//         for (let i = 0; i < files.length; i++) {
//             const file = files[i];
//             const path = file.path;
//             const newMedia = {
//                 url: path
//             };
//             newPost.media.push(newMedia);
//         }
//         await newPost.save();
//         var user = await User.findById(req.session.user._id);
//         user.posts.push(newPost._id);
//         await user.save();
//         req.session.user = user;
//         console.log(newPost)
//         res.redirect('/main');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// }

exports.postPost = async (req, res, next) => {
    try {
        const { content, location, visibility } = req.body;
        const files = req.files;

        const user = await User.findById(req.session.user._id);
        const newPost = await user.createPost(content, location, visibility, files);

        req.session.user = user;
        console.log(newPost);
        res.redirect('/main');
    } catch (err) {
        next(err);
    }
};
// exports.deletePost = async (req, res, next) => {
//     try {
//         const post = await Post.findById(req.body.post_id);

//         // Kiểm tra xem bài đăng có thuộc về người dùng hiện tại không
//         if (!post.author.equals(req.session.user._id)) {
//             console.log("kkkkk")
//             return res.status(403).send('Unauthorized');
//         }
//         var user = await User.findById(req.session.user._id);
//         user.posts.pull(post._id);
//         user.save();
//         await Post.deleteOne({ _id: req.body.post_id })
//         req.session.user = user;
//         var path = '/profile?username=' + user.name;
//         res.json({ delete: 'yes' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// }
// exports.updatePost = async (req, res, next) => {
//     try {
//         const { content, location, status, visibility, tags } = req.body;
//         const post = await Post.findById(req.params.id);

//         // Kiểm tra xem bài đăng có thuộc về người dùng hiện tại không
//         if (post.author.toString() !== req.session.user._id.toString()) {
//             return res.status(403).send('Unauthorized');
//         }

//         // Cập nhật nội dung bài đăng
//         post.content = content;
//         post.location = location;
//         post.status = status;
//         post.visibility = visibility;
//         post.tags = tags.split(',').map(tag => tag.trim());

//         // Nếu có file ảnh mới, cập nhật media
//         if (req.file) {
//             post.media = [{
//                 url: '/uploads/' + req.file.filename,
//                 type: 'image'
//             }];
//         }

//         await post.save();
//         res.redirect('/profile');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// }


// exports.likePost = async (req, res, next) => {
//     try {
//         var post = await Post.findById(req.body.post_id);
//         var user = await User.findById(req.session.user._id);

//         // Kiểm tra nếu người dùng đã like post trước đó
//         if (post.likes.includes(user._id)) {
//             post.likes.pull(user._id);
//             user.likeposts.pull(post._id);
//             await post.save();
//             await user.save();
//             req.session.user = user;
//             io.getIO().emit('post', post)
//             return res.status(200).json({ message: 'Unliked the post', liked: false });
//         }

//         post.likes.push(user._id);
//         user.likeposts.push(post._id);
//         await post.save();
//         await user.save();
//         var user_query = await User.findById(post.author);
//         if (user_query.name != user.name) {
//             var data = {
//                 who: user._id,
//                 content: user.name + " đã thích bài viết của bạn",
//                 post: post._id
//             }

//             user_query.notification.push(data);
//             await user_query.save();
//         }
//         req.session.user = user;
//         io.getIO().emit('post', post)
//         return res.status(200).json({ message: 'Liked the post', liked: true });

//         // const user = await User.findById(post.author);
//         // if (user !== req.session.user._id) {
//         //     user.notification.who = req.session.user._id;
//         //     user.notification.post = post;
//         //     user.notification.content = user.name + ' Đã thích 1 post của bạn';
//         // }
//         // res.redirect('/profile');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// };
exports.deletePost = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.user._id);
        await user.deletePost(req.body.post_id);
        req.session.user = user;
        res.json({ delete: 'yes' });
    } catch (err) {
        next(err);
    }
};



exports.updatePost = async (req, res, next) => {
    try {
        const { content, location, visibility } = req.body;
        const deleteFilesArray = JSON.parse(req.body.deleteFilesArray);
        const postId = req.query.post_Id;
        console.log(deleteFilesArray.length)
        console.log(req.files)
        // Tìm bài viết cần cập nhật
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Cập nhật nội dung, địa điểm và tính bảo mật
        post.content = content;
        post.location = location;
        post.visibility = visibility;

        // Xóa các tệp đã chọn khỏi mảng media
        if (deleteFilesArray && deleteFilesArray.length > 0) {
            post.media = post.media.filter(media => !decodeURIComponent(deleteFilesArray.includes(media.url.replace(/\\/g, '/'))));
            for (let i = 0; i< deleteFilesArray.length;i++)
            {
                unlink(decodeURIComponent(deleteFilesArray[i].replace(/\//g, '//')))
            }
        }

        // Thêm các tệp mới vào mảng media
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                post.media.push({
                    url: file.path,
                });
            });
        }

        // Lưu bài viết đã cập nhật
        await post.save();

        res.json({ res: 'successful' });
    } catch (err) {
        next(err);
    }
};

exports.likePost = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.user._id);
        const result = await user.likePost(req.body.post_id, io);
        req.session.user = user;
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
// exports.likeCMT = async (req, res, next) => {
//     try {
//         const comment = await Comment.findById(req.body.comment._id);

//         // Kiểm tra nếu người dùng đã like comment trước đó
//         if (comment.likes.includes(req.session.user._id)) {
//             comment.likes.pull(req.session.user._id);
//             return await comment.likes.save();
//         }
//         const user = await User.findById(comment.user);
//         if (user != req.session.user._id) {
//             user.notification.who = req.session.user._id;
//             user.notification.post = post;
//             user.notification.content = user.name + 'Đã thích 1 comment của bạn';
//         }
//         comment.likes.push(req.session.user._id);
//         await comment.save();

//         return res.json({ like: 'yes' })
//     } catch (err) {
//         console.error(err);
//         return res.json({ like: 'no' })
//     }
// };
// exports.repliesCMT = async (req, res, next) => {
//     try {
//         const comment = await Comment.findById(req.body.comment._id);
//         reply = new Comment();
//         reply.user = req.session.user;
//         reply.content = req.body.content;
//         await reply.save();
//         comment.replies.push(reply._id);
//         const user = await User.findById(comment.user);
//         if (user != req.session.user._id) {
//             user.notification.who = req.session.user._id;
//             user.notification.post = post;
//             user.notification.content = user.name + 'Đã trả lời comment của bạn';
//         }
//     } catch (err) {
//         console.error(err);
//         res.status
//     }

// }
// exports.comment = async (req, res, next) => {
//     try {

//         var post = await Post.findById(req.body.post_id);
//         var user = await User.findById(req.session.user._id);
//         var comment = new Comment();
//         comment.user = user._id;
//         comment.content = req.body.content;
//         await comment.save();
//         user.comments.push(comment._id)

//         post.comments.push(comment._id);
//         await post.save();

//         var user_query = await User.findById(post.author);
//         if (user_query.name != user.name) {
//             var data = {
//                 who: user._id,
//                 content: user.name + " đã bình luận bài viết của bạn",
//                 post: post._id,
//                 comment: comment._id
//             }

//             user_query.notification.push(data);

//         }
//         await user_query.save();
//         var user_cmt = {
//             user_id: user._id,
//             avartar: user.profilePicture,
//             name: user.name,
//             cmt: comment,
//             content: comment.content,
//             createdAt: comment.createdAt,
//             num_cmt: post.comments.length,
//             post_id: post._id
//         }
//         io.getIO().emit('cmt', user_cmt)
//         return res.status(200).json({ message: 'cmt' });
//         // const user = await User.findById(post.author);
//         // if (user != req.session.user._id) {
//         //     user.notification.who = req.session.user._id;
//         //     user.notification.post = post;
//         //     user.notification.content = user.name + 'Đã trả lời comment của bạn';
//         // }
//     } catch (err) {
//         console.error(err);
//         res.status
//     }
// }

// exports.getMain = async (req, res, next) => {
//     const user = req.session.user;
//     const chats = {}
//     const posts = {};
//     const users = {};
//     const comments = {};
//     const user_comments = {};
//     users[user._id] = user;
//     for (const userId of user.followings) {
//         const userFollowing = await User.findById(userId);
//         users[userId] = userFollowing;
//     }
//     for (const key in users) {
//         posts[key] = [];
//         for (const postId of users[key].posts) {
//             const post = await Post.findById(postId);
//             if (post) {
//                 for (const commentId of post.comments) {
//                     const comment = await Comment.findById(commentId);
//                     const user_cmt = await User.findById(comment.user)
//                     comments[commentId] = comment;
//                     user_comments[commentId] = user_cmt;
//                 }
//                 await post.populate({
//                     path: 'author',
//                     select: 'name'
//                 })
//                 posts[key].push(post);
//             }

//         }
//     }
//     for (i = 0; i < user.chats.length; i++) {
//         const chat = await Chat.findById(user.chats[i].chat)
//         if (chat) {
//             await chat.populate([
//                 {
//                     path: 'user',
//                     select: 'name profilePicture'
//                 },
//                 {
//                     path: 'contents.author',
//                     select: 'name profilePicture'
//                 }
//             ])

//             chats[chat._id] = chat
//         }

//     }
//     await user.populate([
//         {
//             path: 'notification.who',
//             select: 'name profilePicture'
//         },
//         {
//             path: 'chats.with',
//             select: 'name profilePicture'
//         }
//     ])
//     console.log('------------------------------------------------------------------------')
//     console.log(chats)
//     res.render('info/main', { user: user, posts: posts, users: users, comments: comments, user_comments: user_comments, chats: chats });
// }

// exports.postFollow = async (req, res, next) => {
//     try {
//         var user = await User.findById(req.session.user._id);
//         var name = req.query.username;
//         var c = false;
//         var user_query = await User.findOne({ name });
//         for (id of user.followings) {
//             if (id.equals(user_query._id)) {
//                 user.followings.pull(id)
//                 user_query.followers.pull(user._id)
//                 c = true;
//                 break;
//             }
//         }

//         if (!c) {
//             user.followings.push(user_query._id)
//             user_query.followers.push(user._id)
//             var data = {
//                 who: user._id,
//                 content: user.name + " đã follow bạn"
//             }

//             user_query.notification.push(data)
//         }


//         await user.save();

//         req.session.user = user;
//         await user_query.save();
//         path = '/profile?username=' + user_query.name
//         res.redirect(path)

//     } catch (err) {
//         console.error(err);
//         res.status
//     }
// }

exports.comment = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.user._id);
        const comment = await user.commentOnPost(req.body.post_id, req.body.content);

        const post = await Post.findById(req.body.post_id);
        const user_cmt = {
            user_id: user._id,
            avatar: user.profilePicture,
            name: user.name,
            cmt: comment,
            content: comment.content,
            createdAt: comment.createdAt,
            num_cmt: post.comments.length,
            post_id: post._id
        };
        io.getIO().emit('cmt', user_cmt);
        return res.status(200).json({ message: 'cmt' });
    } catch (err) {
        next(err);
    }
};

exports.getMain = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.user._id);

        // Get main data
        const { users, posts, comments, user_comments } = await user.getMainData();

        // Get chats data
        const chats = await user.getChatsData();

        // Populate notifications and chats
        await user.populate([
            {
                path: 'notification.who',
                select: 'name profilePicture'
            },
            {
                path: 'chats.with',
                select: 'name profilePicture'
            }
        ]);

        res.render('info/main', {
            user,
            posts,
            users,
            comments,
            user_comments,
            chats
        });
    } catch (err) {
        next(err);
    }
};

exports.postFollow = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.user._id);
        const user_query = await user.followUser(req.query.username, io);

        req.session.user = user;
        const path = '/profile?username=' + user_query.name;
        res.redirect(path);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
exports.test = async (req, res, next) => {
    try {

        res.render('info/test', {})

    } catch (err) {
        next(err);
    }
}
exports.getChat = async (req, res, next) => {
    try {

        const user = req.session.user;
        const user_query_id = req.query.toUser;
        var user_query = await User.findById(user_query_id)
        var chat = false;
        for (let i = 0; i < user.chats.length; i++) {
            if (user.chats[i].with.equals(user_query._id)) {
                chat_id = user.chats[i].chat
                chat = await Chat.findById(chat_id)
                break
            }

        }
        if (chat) {

            await chat.populate('contents.author', 'name profilePicture');
            return res.status(200).json({ chat: 'yes', data: chat });

        } else {

            return res.status(200).json({ chat: 'no' });
        }
    } catch (err) {
        next(err);
    }
}


exports.postChat = async (req, res, next) => {
    try {
        var content = req.body.content
        var user = req.session.user
        var user_query_id = req.query.toUser
        var user_query = await User.findById(user_query_id)
        var chat_id = 0
        var chat = false
        for (let i = 0; i < user.chats.length; i++) {
            if (user.chats[i].with.equals(user_query._id)) {
                chat_id = user.chats[i].chat
                chat = await Chat.findById(chat_id)
                break
            }

        }
        var data = {
            content: content,
            author: user,
        }
        if (chat) {
            chat.contents.push(data)
            await chat.save()
        } else {
            chat = new Chat()
            chat.user.push(user._id, user_query._id)
            chat.contents.push(data)
            await chat.save()
            user.chats.push({ with: user_query._id, chat: chat._id });
            user_query.chats.push({ with: user._id, chat: chat._id });
            await user.save()
            await user_query.save()
        }
        await chat.populate('contents.author', 'name profilePicture')
        req.session.user = user
        return res.json({ chat: chat.contents[chat.contents.length - 1], before: "yes" })

    } catch (err) {
        next(err);
    }
}

exports.getSearch = async (req, res, next) => {
    try {
        const info = req.query.info;
        console.log(info)
        const user = req.session.user;
        const users = await User.find({
            name: { $regex: new RegExp(info, 'i'), $ne: user.name }
        }).select('name profilePicture');
        return res.json(users)
    }
    catch (err) {
        next(err);
    }
}