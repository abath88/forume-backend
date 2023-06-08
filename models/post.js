const 
  voting = require('mongoose-voting'),
  mongoose = require('mongoose'),
  { Schema } = require('mongoose');

  postSchema = new Schema({
    title: { 
      type: String,
      required: true
    },
    link: { 
      type: String,
    },
    text: { 
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    _creator: {
      type: Schema.ObjectId, 
      ref: 'User'
    },
    _comments: [{ type: Schema.ObjectId, ref: 'Comment' }],
  });

postSchema.plugin(voting);

const Post = mongoose.model('Post', postSchema);



module.exports = Post