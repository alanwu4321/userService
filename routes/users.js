var express = require('express');
var router = express.Router();
var mongoLib = require('../lib/_db')
mongoose = require('mongoose');
const crypto = require('crypto');

  //POST users new user
  router.post('/', async function (req, res, next) {
    try {
      await mongoLib.initConnection('users')
      user = mongoLib.createUser(req.body.payload)
      user.save(function () {
        res.status(200).json({
          "status": "success"
        });
      });
    } catch (err) {
      console.log(err)
    }
  });

  const hashed = (str) => {
    const secret = 'abcdefg'
    return crypto.createHmac('sha256', secret)
                    .update(str)
                    .digest('hex')
  }

  // console.log(hashed("a"))

  router.post('/login', async function (req, res, next) {
    try {
      let {password, name} = req.body.payload
      console.log(password, name)
      await mongoLib.initConnection('users')
      User = mongoLib.getUser()
      isValid = await mongoLib.authUser(User,name,password)
      if(isValid){
        token = hashed(name.toLowerCase())
        User.findOneAndUpdate({name:name.toLowerCase()}, {token:token}, function(err,user){
          console.log(user)
          if(err) return console.error(err)
          res.status(200).json({
            "status": "success",
            "res": {"user":user,"token":token}
          });
        })
      }else{
        res.status(400).json({
          "status": "error",
          "res": "Incorrect credentials"
        });
      }
    } catch (err) {
      console.log(err)
    }
  });

// get all users
router.get('/', async function (req, res, next) {
  try {
    await mongoLib.initConnection('users')
    User = mongoLib.getUser()
    User.find(function (err, users) {
      if (err) return console.error(err);
      res.status(200).json({
        "status": "success",
        "res": users
      });
    }).limit(10).skip(0)
  } catch (err) {
    console.log(err)
  }
});


router.patch("/:user_id", async function (req, res, next) {
  try {
    var query = {_id:req.params.user_id}
    var patch = req.body.payload
    await mongoLib.initConnection('users')
    User = mongoLib.getUser()
    User.findOneAndUpdate(query, patch, function(err,user){
      if(err) return console.error(err)
      res.status(200).json({
        "status": "success",
        "res": user
      });
    })
  } catch (err) {
    console.log(err)
  }
});


router.get("/:user_id", async function (req, res, next) {
  try {
    var user_id = req.params.user_id
    await mongoLib.initConnection('users')
    User = mongoLib.getUser()
    User.findById(user_id, function (err, user) {
      if(err) return console.error(err)
      res.status(200).json({
        "status": "success",
        "res": user
      });
    })
  } catch (err) {
    console.log(err)
  }
});




module.exports = router;