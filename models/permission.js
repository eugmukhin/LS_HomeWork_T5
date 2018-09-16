const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/* const defaultGrands = {
  chat: { C: false, R: true, U: true, D: false },
  news: { C: false, R: true, U: false, D: false },
  setting: { C: false, R: false, U: false, D: false }
}; */

const permissionSchema = new Schema({
  chat: {
    C: { type: Boolean, default: false },
    R: { type: Boolean, default: true },
    U: { type: Boolean, default: true },
    D: { type: Boolean, default: false }
  },
  news: {
    C: { type: Boolean, default: false },
    R: { type: Boolean, default: true },
    U: { type: Boolean, default: false },
    D: { type: Boolean, default: false }
  },
  setting: {
    C: { type: Boolean, default: false },
    R: { type: Boolean, default: false },
    U: { type: Boolean, default: false },
    D: { type: Boolean, default: false }
  }
});

permissionSchema.methods.set = function (data) {
  const mix = function (base, data) {
    let ret = data || base;
    for (let element in base) {
      ret[element] = ret[element] || base[element];
    }
    return ret;
  };

  this.chat = mix(this.chat, data.chat);
  this.news = mix(this.news, data.news);
  this.setting = mix(this.setting, data.setting);

  return this;
};

permissionSchema.methods.setFullAccess = function () {
  for (let prop in this.toObject()) {
    if (prop !== '_id') {
      this[prop] = { C: true, R: true, U: true, D: true };
    }
  }
  return this;
};

if (!permissionSchema.options.toObject) permissionSchema.options.toObject = {};

permissionSchema.options.toObject.transform = function (doc, ret, options) {
  delete ret.__v;
  return ret;
};

mongoose.model('permission', permissionSchema);
