const
  db = require('./../models'),
  jwt = require('jsonwebtoken');
  userController = {};

userController.signUp = (req, res) => {
  const { username, password, mail } = req.body;

  // Validation
  const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;

  if(!regexExp.test(mail)){
    return res.status(500).json({
      message: 'not a valid mail'
    })
  }

  const user = new db.User({
    username,
    password,
    mail
  });

  user
    .save()
    .then((newUser) => {
      return res.status(200).json({
        success: true,
        data: newUser
      })
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).json({
        message: err
      })
    });
}

userController.signIn = (req, res) => {
  db.User
  .findOne({ username: req.body.username })
  .exec()
  .then((user) => {
    if (!user) res.status(401).json({message: 'Authentication failed. User not found.'});
    else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          const token = jwt.sign(user.toJSON(), process.env.SECRET);
          return res.status(200).json({ success: true, token: token });
        } else {
          return res.status(401).json({message: 'Authentication failed. Wrong password.'});
        }
      });
    }
  })
  .catch(err => res.status(500).json({ message: err }));
};

userController.getUsers = (req, res) => {
  db.User.find({}).then(users => {
    return res.status(200).json({success: true, users})
  })
}

module.exports = userController