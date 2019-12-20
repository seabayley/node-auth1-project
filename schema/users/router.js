const express = require('express')

const userModel = require('./model')

const router = express.Router()

const bcrypt = require('bcryptjs')

router.post('/signup', (req, res) => {
    const credentials = req.body
    const hash = bcrypt.hashSync(credentials.password, 14)
    credentials.password = hash
    userModel.addUser({username: credentials.username, password: credentials.password})
    .then(data => {
        res.status(201).json(data)
    })
    .catch(err => {
        res.status(500).json({message: "Failed to create new user"})
    })
})


router.get('/users', restricted, (req, res) => {
    userModel.getUsers()
    .then(data => {
      res.status(200).json(data)
    })
    .catch(err => {
      res.status(500).json({message: 'Failed to find users.'})
    })
})

router.post('/login', (req, res) => {
    let { username, password } = req.body;
  
    userModel.findByUsername({ username })
      .first()
      .then(user => {
        // check that passwords match
        if (user && bcrypt.compareSync(password, user.password)) {
          req.session.user = user
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          // we will return 401 if the password or username are invalid
          // we don't want to let attackers know when they have a good username
          res.status(401).json({ message: 'You shall not pass!' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  router.get("/logout", (req, res) => {
    if (req.session) {
      req.session.destroy(error => {
        if (error) {
          res.status(500).json({
            message:
              "Error logging out.",
          });
        } else {
          res.status(200).json({ message: "You have logged out." });
        }
      });
    } else {
      res.status(200).end();
    }
  });
  

module.exports = router;

function restricted(req, res, next) {
    if (req.session && req.session.user) {
      next();
    } else {
      res.status(401).json({ message: "You shall not pass!!" });
    }
  };