require('dotenv').config();

const 
  express = require('express'),
  router = require('./router'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  Strategy = require('passport-jwt').Strategy,
  extractJwt = require('passport-jwt').ExtractJwt,
  db = require('./models');
  url =`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_ADDRESS}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

mongoose.Promise = global.Promise;
mongoose.connect(url).then(() => console.log('Connected to Database.'));

const app = express();  

app.use(bodyParser.json());

passport.use(new Strategy({
  jwtFromRequest: extractJwt.fromAuthHeaderWithScheme("Bearer"),
  secretOrKey: process.env.SECRET
}, (jwt_payload, done) => {
  db.User
    .findById(jwt_payload._id)
    .then( user => {
      user ? 
        done(null, user):
        done(null, false)
      }
    )
    .catch( err => done(err, false));
}));

app.use(passport.initialize());

app.use('/api', router);

module.exports = app
