const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB"
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user.id
    });
  });
};

//signin
exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }


  User.findOne({ email }, (err, user) => {
    if (err||!user ) {
      return res.status(400).json({
        error: "USER email does not exists"
      });
    }

    if (!user.autheticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match"
      });
    }

        //create token
        const token = jwt.sign({ id: user.id }, process.env.SECRET);
        //put token in cookie
        res.cookie("token", token, { expire: new Date() + 9999 });
    
        //send response to front end
        const { id, name, email } = user;
        return res.json({ token, user: { id, name, email } });
      });
    };
    

//signout
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfull!"
  });
};

