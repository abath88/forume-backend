const 
  voting = require('mongoose-voting'),
  mongoose = require('mongoose'),
  { Schema } = require('mongoose');

  commentSchema = new Schema({
    text: { 
        type: String,
        required: true
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
    _post: { 
        type: Schema.ObjectId, 
        ref: 'Post' 
    },
  }),

  autoPopulateCreator = function(next) {
    this.populate({
        path: '_creator',
        select: 'usename createdAt -_id'
    });
  };


commentSchema.pre('find', autoPopulateCreator);
commentSchema.plugin(voting);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment