const
  routes = require('express').Router(),
  passport = require('passport'),
  basicController = require('./controllers/basicController'),
  userController = require('./controllers/userController'),
  postController = require('./controllers/postController'),
  commentController = require('./controllers/commentController');


// Basic Routes
routes.get('/', basicController.get);

// User Routes
routes.post('/signup', userController.signUp);
routes.post('/signin', userController.signIn);
routes.get('/users', userController.getUsers);

//Post Routes
routes.post('/post', passport.authenticate('jwt', { session: false }), postController.post);
routes.get('/post/:id', postController.get);
routes.get('/post', postController.getAll);
routes.post('/post/:id/upvote', passport.authenticate('jwt', { session: false }), postController.upvote);
routes.post('/post/:id/downvote', passport.authenticate('jwt', { session: false }), postController.downvote);

//Comment Routes
routes.post('/comment', passport.authenticate('jwt', { session: false }), commentController.post);
routes.post('/comment/:id/upvote', passport.authenticate('jwt', { session: false }), commentController.upvote);
routes.post('/comment/:id/downvote', passport.authenticate('jwt', { session: false }), commentController.downvote);

module.exports = routes