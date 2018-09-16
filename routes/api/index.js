const express = require('express');
const app = (module.exports = express());
const HttpError = require('../../libs/error');
const auth = require('../../libs/auth');

// Auth & Reg
app.use('/login', require('./login'));
app.use('/saveNewUser', require('./save_new_user'));
app.use('/authFromToken', auth.authByToken, auth.isAuthenticated, require('./auth_from_token'));

// News
app.use('/getNews', auth.isAuthorized('news', 'R'), require('./get_news'));
app.use('/newNews', auth.isAuthorized('news', 'C'), require('./new_news'));
app.use('/updateNews', auth.isAuthorized('news', 'U'), require('./update_news'));
app.use('/deleteNews', auth.isAuthorized('news', 'D'), require('./delete_news'));

// Settings
app.use('/getUsers', auth.isAuthorized('setting', 'R'), require('./get_users'));
app.use('/updateUserPermission', auth.isAuthorized('setting', 'U'), require('./update_permission'));
app.use('/deleteUser', auth.isAuthorized('setting', 'D'), require('./delete_user'));

// User profile
app.use('/updateUser', auth.isAuthenticated, require('./update_user'));
app.use('/saveUserImage', auth.isAuthenticated, require('./save_user_image'));

app.get('/', (req, res) => {
  throw new HttpError('wrong query, choose /login', 400);
});
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Page not found' });
});
