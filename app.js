const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const errorController = require('./controllers/error');
const User = require('./models/User');

const MONGODB_URI =
  'mongodb://localhost:27017/haha';

const app = express();



const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();


// Multer storage configuration for avatar
const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    // Ensure unique filenames to avoid overwriting
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.session.user._id + '-' + uniqueSuffix + file.originalname);
  }
});



app.set('view engine', 'ejs');
app.set('views', 'views');

const authRoutes = require('./routes/auth');
const mainRoutes = require('./routes/main');
const socketStore = require('./socketStore');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(
  multer({ storage: Storage }).array('Picture_Video', 10)
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    return next();
  }
  User.findOne({ email: req.session.user.email })
    .then(user => {
      if (!user) {
        return next();
      }
      // req.user = user;
      req.session.user = user

      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(authRoutes);
app.use(mainRoutes);
app.get('/500', errorController.get500);

app.use(errorController.get404);

// app.use((error, req, res, next) => {
//   // res.status(error.httpStatusCode).render(...);
//   // res.redirect('/500');
//   res.redirect('/500')
// });




mongoose
  .connect(MONGODB_URI)
  .then(result => {
    const server = app.listen(3000);
    const io = require('./socket').init(server).on('connection', socket => {
      console.log('Client connected: ', socket.id);
      socket.on('getchat', (data) => {
        socket.join(data)

      })
      socket.on('ungetchat', (data) => {
        delete  socketStore.socketStore_chat.sockets[data]
      })
      socket.on('newchat', async ({ content, to, from }) => {
        const user = await User.findById(from)
        socket.to(to).emit("newchat", {
          content,
          from: user.profilePicture,
          room: to
        });
      })
      socket.on('getchat2', (data) => {
        socketStore.socketStore_chat.sockets[data] = socket.id

      })
      socket.on('newchat2', async ({ content, to, from }) => {
        const user = await User.findById(from)
        const targetSocketId = socketStore.socketStore_chat.sockets[to];
        console.log()
        if (targetSocketId) {
          socket.to(targetSocketId).emit("newchat2", {
            content,
            from: user.profilePicture
          });
        } else {
          console.error(`No socket found for user: ${to}`);
        }
      })
      socket.on('getUserlogin',(data)=>{
        socketStore.socketStore_not.sockets[data] = socket.id
      })
      socket.on('Notification',(data)=>{})
      socket.on('disconnect', () => {
        console.log('Client disconnected: ', socket.id);
      });
    });
  })
  .catch(err => {
    console.log(err);
  });
