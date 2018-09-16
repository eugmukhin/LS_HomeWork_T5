const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const textParser = require('./libs/text-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const config = require('./config');
const upload = multer({ dest: path.join(__dirname, config.upload) });
require('./models');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(upload.any());
app.use(textParser);
app.use(cookieParser());

app.use(
  session({
    secret: 'secret',
    key: 'keys',
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: null
    },
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

require('./config/config-passport');
app.use(passport.initialize());
app.use(passport.session());

require('./routes')(app);

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500).json({ error: err.message });
});

const chatLib = require('./libs/chat');

io.on('connection', chatLib.onConnection);

http.listen(process.env.PORT || 3000, function () {
  console.log(`listening on *:${http.address().port}`);
});
