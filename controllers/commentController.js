const db = require('../models')

const commentController = {};

commentController.post = (req, res) => {
  const {
    text,
    postId,
  } = req.body;

  const comment = new db.Comment({
    text,
    postId,
    _creator: req.user._id
  });

  comment
    .save()
    .then((newComment) => {
      db
        .Post
          .findByIdAndUpdate(
            postId,
            { $push: { '_comments': newComment._id } }
          )
          .then( (existingPost) => {
            res.status(200).json({
              success: true,
              data: newComment, 
              existingPost
            })
          })
          .catch( (err) => {
            res.status(500).json({
              message: err
            })
         })
      return res.status(200).json({
        success: true,
        data: newComment
      })
    })
    .catch((err) => {
       return res.status(500).json({
        message: err
       })
    })
};

commentController.upvote = (req, res) => {
  const commentId = req.params.id;

  db.Comment.findById(commentId).then( comment => {
    if(comment){
      if(comment.upvoted(req.user._id.toHexString())){
        comment.unvote(req.user._id.toHexString());
      }else {
        comment.upvote(req.user._id.toHexString());
      }
      comment.save();

      return res.status(200).json({
        success: true,
        data: comment
      })
    }

    return res.status(404).json({
      message: "Comment not found"
    })
  }).catch((err) => {
    return res.status(500).json({
      message: err
    })
  })
};

commentController.downvote = (req, res) => {
  const commentId = req.params.id;

  db.Comment.findById(commentId).then( comment => {
    if(comment){
      if(comment.downvoted(req.user._id.toHexString())){
        comment.unvote(req.user._id.toHexString());
      }else {
        comment.downvote(req.user._id.toHexString());
      }
      return res.status(200).json({
        success: true,
        data: comment
      })
    }

    return res.status(404).json({
      message: "Comment not found"
    })
  }).catch((err) => {
    return res.status(500).json({
      message: err
    })
  })
};

module.exports = commentController;