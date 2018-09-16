const mongoose = require('mongoose');
const bCrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');

const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: { type: String },
  hash: { type: String },
  firstName: { type: String },
  surName: { type: String },
  middleName: { type: String },
  access_token: { type: String },
  image: { type: String },
  permission: { type: Schema.Types.ObjectId, ref: 'permission' }
});

userSchema.methods.setPassword = function (password) {
  this.hash = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  return this;
};

userSchema.methods.setAccessToken = function () {
  this.access_token = uuidv4();
  return this;
};

userSchema.methods.validPassword = function (password) {
  return bCrypt.compareSync(password, this.hash);
};

userSchema.methods.checkAccess = function (grp, oper) {
  if (this.permission[grp]) {
    return this.permission[grp][oper];
  } else {
    return false;
  }
};

if (!userSchema.options.toObject) userSchema.options.toObject = {};

userSchema.options.toObject.transform = function (doc, ret, options) {
  ret.id = ret._id;
  ret.permissionId = ret.permission._id;
  delete ret.permission._id;
  delete ret._id;
  delete ret.hash;
  delete ret.__v;
  return ret;
};

mongoose.model('user', userSchema);
