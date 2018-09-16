const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const mongoose = require('mongoose');

let username = '';
let password = '';

function exit (e) {
  if (e) console.log(e);
  mongoose.connection.close(() => {
    process.exit(0);
  });
}

rl.question('Username: ', answer => {
  username = answer;
  rl.question('Password: ', answer => {
    password = answer;
    rl.close();
  });
});

rl.on('close', () => {
  require('../models');
  const User = mongoose.model('user');
  const Permission = mongoose.model('permission');

  User.findOne({ username: username })
    .then(user => {
      if (user) {
        throw new Error('Пользователь с таким логином уже существует');
      } else {
        const newPermission = new Permission();
        newPermission
          .setFullAccess()
          .save()
          .then(permission => {
            const newUser = new User();

            newUser.username = username;
            newUser.permission = permission;

            newUser
              .setPassword(password)
              .save()
              .then(() => {
                console.log(`User ${username} successfully created!`);
                exit();
              })
              .catch(exit);
          })
          .catch(exit);
      }
    })
    .catch(exit);
});
