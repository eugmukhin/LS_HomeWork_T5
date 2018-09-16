const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  text: { type: String },
  theme: { type: String },
  date: { type: String }
});

if (!newsSchema.options.toObject) newsSchema.options.toObject = {};

newsSchema.options.toObject.transform = function (doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
  if (ret.user.access_token) {
    delete ret.user.access_token;
  }
  return ret;
};

mongoose.model('news', newsSchema);
