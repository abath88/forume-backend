const 
  mongoose = require('mongoose'),
  bcrypt = require('bcryptjs'),
  { Schema } = require('mongoose');

  userSchema = new Schema({
    username: {
      type: String,
      unique: true,
      required: true,
      minlength: [5, 'Username must be 5 characters or more'],
    },
    mail: {
      type: String, 
      unique: true, 
      lowercase: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, 'Password must be 8 characters or more'],
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
  });

userSchema.pre('save', function (next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(user.password, salt);
      user.password = hash;
  }
  next();
});

userSchema.methods.comparePassword = function (password, done) {
  bcrypt.compare(password, this.password, 
    (err, isMatch) => 
      err ? 
        done(err) :
        done(null, isMatch)
  );
};

const User = mongoose.model('User', userSchema);

module.exports = User