const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth')
const main = require('../controllers/main');
router.get('/infomation',isAuth,main.getInfomation);
router.post('/infomation',isAuth,main.postInfomation);
router.get('/profile',isAuth,main.getProfile);
router.get('/main',isAuth,main.getMain);
router.post('/main',isAuth,main.postPost);
router.post('/follow',isAuth,main.postFollow);
router.post('/deletepost',isAuth,main.deletePost);
router.get('/post',main.getPost)
router.post('/likepost',isAuth,main.likePost);
router.post('/cmtpost',isAuth,main.comment);
router.get('/chat', main.getChat)
router.post('/chat', main.postChat)
router.put('/post',main.updatePost)
router.get('/search',main.getSearch)

module.exports = router;
