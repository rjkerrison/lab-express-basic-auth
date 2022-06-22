const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

const router = require('express').Router();
const saltRounds = 10;

/*
  GET /signup
  Show a signup form.
  */
router.get('/signup', async (req, res, next) => {
    const root = __dirname.replace('routes', '')
    console.log(root)
    res.sendFile('views/auth/signup.html', { root })
  });

/*$!
  POST /signup
  The user send his informations and send an attempt of signing in.
 */


router.post('/signup', async (req, res, next) => {
    try{
        const {username, password} = req.body;

        const foundUser = await User.findOne({username});
        if(foundUser) {
            return res.status(401).json({message : "Username already exists : please log in or chose another username."});
        };
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const createdUser = await User.create({
            username,
            password : hashedPassword,
        })
        res.status(201).json(createdUser);


    } catch(error){
        console.log(error);
        next(error);
    }
})

module.exports = router;