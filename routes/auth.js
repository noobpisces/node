const express = require('express');
const { check, body } = require('express-validator');
check
const authController = require('../controllers/auth');
const Account = require('../models/Account');
const User = require('../models/User');
const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin
);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return Account.findOne({ email: value }).then(Account => {
          if (Account) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .isLength({ min: 5 })
      .withMessage('Please enter a password with only numbers and text and at least 5 characters.')
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      }),
    body('name')
      .isLength({ min: 5 }).withMessage('Tên phải có ít nhất 5 ký tự')
      .custom(async (value, { req }) => {
        // Kiểm tra xem tên có chứa dấu cách không
        if (/\s/.test(value)) {
          throw new Error('Tên không được chứa dấu cách');
        }

        // Kiểm tra xem tên đã tồn tại trong cơ sở dữ liệu chưa
        const user = await User.findOne({ name: value });
        if (user) {
          throw new Error('Tên này đã tồn tại trong hệ thống');
        }
      })

  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', [
  body('password')
  .isLength({ min: 5 })
  .withMessage('Please enter a password with only numbers and text and at least 5 characters.')
  .isAlphanumeric()
  .trim()], 
  authController.postReset);

// router.post('/new-password', authController.postNewPassword);


router.post('/check_signup', authController.postCheck_signup)



router.post('/post_reset', authController.post_reset)

module.exports = router;
