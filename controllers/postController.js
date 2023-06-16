const db = require('../models')

const postController = {};

postController.post = (req, res) => {
  const {
    title,
    text,
    link
  } = req.body;

  const post = new db.Post({
    title,
    text,
    link,
    _creator: req.user._id
  });

  post.save().then((newPost) => {
      return res.status(200).json({
        success: true,
        data: newPost
      })
    }).catch((err) => {
       return res.status(500).json({
        message: err
       })
    })
};

postController.getAll = (req, res) => {
  db.Post.find({}).populate({
      path: '_creator',
      select: 'username -_id'
    }).populate({
      path: '_comments',
      select: 'text',
      match: { 'isDeleted': false }
    }).then((posts) => {
      return res.status(200).json({
        success: true,
        data: posts
      })
    }).catch((err) => {
      return res.status(500).json({
        message: err
      })
    })
};

postController.get = (req, res) => {
  db.Post.findById(req.params.id).populate({
    path: '_creator',
    select: 'username -_id'
  }).populate({
    path: '_comments',
    select: 'text createdAt _creator',
    match: { 'isDeleted': false }
  }).then((post) => {
    return res.status(200).json({
      success: true,
      data: post
    })
  }).catch((err) => {
    return res.status(500).json({
      message: err
    })
  })
}

postController.upvote = (req, res) => {
  const postId = req.params.id;
  
  db.Post.findById(postId).then( post => {
    if(post != null){
      if(post.upvoted(req.user._id.toHexString())){
        post.unvote(req.user._id.toHexString());
      }else {
        post.upvote(req.user._id.toHexString());
      }
      post.save();
      return res.status(200).json({
        success: true,
        data: post
      })
    }
    return res.status(404).json({
      message: "Post not found"
    })
  }).catch((err) => {
    console.log(err)
    return res.status(500).json({
      message: JSON.stringify(err)
    })
  })
};

postController.downvote = (req, res) => {
  const postId = req.params.id;

  db.Post.findById(postId).then( post => {
    if(post) {
      if(post.downvoted(req.user._id.toHexString())){
        post.unvote(req.user._id.toHexString());
      }else {
        post.downvote(req.user._id.toHexString());
      }
      post.save();
      return res.status(200).json({
        success: true,
        data: post
      })
    }
    return res.status(404).json({
      message: "Post not found"
    })
  }).catch((err) => {
    return res.status(500).json({
      message: err
    })
  })
};

module.exports = postController;