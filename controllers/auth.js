const crypto = require('crypto');

const bcrypt = require('bcryptjs');

const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const Account = require('../models/Account');
const User = require('../models/User');
const { access } = require('fs/promises');



// async function login(emailId) {
//   try {
//     const res = await Auth(emailId, "Company Name");
//     console.log(res);
//     console.log(res.mail);
//     console.log(res.OTP);
//     console.log(res.success);
//   } catch (error) {
//     console.log('dhajhbfdakbadf');
//   }
// }
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "jettie.huel18@ethereal.email",
    pass: "eaAQDtEQyacREmANkw",
  },
});

exports.post_reset = async (req, res, next) => {
  const email = req.body.email;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/reset', {
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
      },
      validationErrors: errors.array()
    });
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  req.session.otp = otp
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    to: `${email}`, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `${otp}`, // html body
  });

  console.log(email);
  return res.render('auth/check_reset', {
    email,

  });
}

exports.postCheck_signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name
  const otp = req.body.otp
  if (otp == req.session.otp) {
    delete req.session.otp;
    bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
        const acc = new Account({
          email: email,
          password: hashedPassword
        });
        const user = new User({
          email: email,
          name: req.body.name
        });
        acc.save();
        user.save();
      }).then(rest => {
        res.redirect('/login');
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  } else {
    console.log('saiotp')
  }
}

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }

  Account.findOne({ email: email })
    .then(acc => {
      if (!acc) {
        return res.status(422).render('auth/login', {
          errorMessage: 'Invalid email or password.',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      }
      bcrypt
        .compare(password, acc.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            User.findOne({ email: email })
              .then(user => {
                req.session.user = user;
                return req.session.save(() => {

                  res.redirect('/main');
                })


              });

            return;
          }

          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        name: req.body.name,
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array()
    });
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  req.session.otp = otp
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    to: `${email}`, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `${otp}`, // html body
  });

  console.log(email);
  return res.render('auth/check', {
    password,
    email,
    name

  });
  // bcrypt
  //   .hash(password, 12)
  //   .then(hashedPassword =>  {
  //     const acc = new Account({
  //       email: email,
  //       password: hashedPassword
  //     });
  //     const user = new User({
  //       email: email,
  //       name: req.body.name
  //     });
  //     acc.save();
  //     user.save();
  //   })
  //   .then(()=>{
  //     LoginCredentials.mailID = "epointclone1@gmail.com";

  //     // You can store them in your env variables and
  //     // access them, it will work fine
  //     LoginCredentials.password = "Tuan_20042003";
  //     LoginCredentials.use = true;

  //     // Pass in the mail ID you need to verify
  //     return Auth("nguyenanhtuan20403@gmail.com", "Company Name");
  //   }).then(rest  => {
  //     console.log(rest);
  //     res.redirect('/login');
  //     // return transporter.sendMail({
  //     //   to: email,
  //     //   from: 'shop@node-complete.com',
  //     //   subject: 'Signup succeeded!',
  //     //   html: '<h1>You successfully signed up!</h1>'
  //     // });
  //   })
  // .catch(err => {
  //   const error = new Error(err);
  //   error.httpStatusCode = 500;
  //   return next(error);
  // });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/login');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    errorMessage: message
  });
};
exports.postReset = (req, res, next) => {
  const newPassword = req.body.new_password;
  const email = req.body.email
  const otp = req.session.otp;
  console.log(otp, typeof otp);
  console.log(req.body.otp, typeof req.body.otp);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/reset', {
      
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
      },
      validationErrors: errors.array()
    });
  }
  if (otp == req.body.otp) {
    delete req.session.otp;
    Account.findOne({ email: req.body.email })
      .then(acc => {
        if (!acc) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset');
        }
        bcrypt
          .hash(newPassword, 12)
          .then(hashedPassword => {
            acc.password = hashedPassword;
            return acc.save();
          })
          .then(() => {
            res.redirect('/login');
          })
          .catch(err => {
            next(err);
          });
      })
      .catch(err => {
        next(err);
      });
  } else {
    req.flash('error', 'Sai OTP');
    res.redirect('/reset');
  }
};


// exports.getNewPassword = (req, res, next) => {
//   const token = req.params.token;
//   User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
//     .then(user => {
//       let message = req.flash('error');
//       if (message.length > 0) {
//         message = message[0];
//       } else {
//         message = null;
//       }
//       res.render('auth/new-password', {
//         path: '/new-password',
//         pageTitle: 'New Password',
//         errorMessage: message,
//         userId: user._id.toString(),
//         passwordToken: token
//       });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

// exports.postNewPassword = (req, res, next) => {
//   const newPassword = req.body.password;
//   const userId = req.body.userId;
//   const passwordToken = req.body.passwordToken;
//   let resetUser;

//   User.findOne({
//     resetToken: passwordToken,
//     resetTokenExpiration: { $gt: Date.now() },
//     _id: userId
//   })
//     .then(user => {
//       resetUser = user;
//       return bcrypt.hash(newPassword, 12);
//     })
//     .then(hashedPassword => {
//       resetUser.password = hashedPassword;
//       resetUser.resetToken = undefined;
//       resetUser.resetTokenExpiration = undefined;
//       return resetUser.save();
//     })
//     .then(result => {
//       res.redirect('/login');
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };
