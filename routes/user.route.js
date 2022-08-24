const router = require('express').Router()
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const salt = 10


router.get('/', async (req, res, next) => {
    try {
        const allUsers = await User.find()
        return res.status(200).json(allUsers)
    } catch (error) {
        next(error)
    }
})

router.post('/signup', async (req, res, next) => {
    const {
        username,
        password
    } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            message: 'please provide username and password'
        })
    }
    const findUser = await User.findOne({
        username
    })

    if (findUser) {
        return res.status(400).json({
            message: 'User already exist'
        })
    }
    try {
        const generateSalt = bcrypt.genSaltSync(salt)
        const hashPassword = bcrypt.hashSync(password, generateSalt)
        const userToCreate = {
            username: username,
            password: hashPassword
        }
        const newUser = await User.create(userToCreate)
        res.status(200).json(newUser)
    } catch (error) {
        next(error)
    }
})




// get the info the user sent
router.post("/login", async (req, res, next) => {
    const {
        username,
        password
    } = req.body;
    if (!username || !password) {
        return res
            .status(400)
            .json({
                message: "Please provide username and password"
            });
    }
    try {
        const findUser = await User.findOne({
            username
        });
        if (!findUser) {
            return res.status(400).json({
                message: "wrong credentials"
            });
        }
        const matchingPassword = bcrypt.compareSync(password, findUser.password);
        if (!matchingPassword) {
            return res.status(400).json({
                message: "wrong credentials"
            });
        }
        const payload = {
            username
        };
        const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: "1h",
        });
        res.status(200).json(token);
    } catch (error) {
        next(error);
    }
});

module.exports = router

// module.exports = (req, res, next) => {
//   try {
//     const token = req.body.authorization.split(' ')[1];
//     const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
//     const userId = decodedToken.userId;
//     if (req.body.userId && req.body.userId !== userId) {
//       throw 'Invalid user ID';
//     } else {
//       next();
//     }
//   } catch {
//     res.status(401).json({
//       error: new Error('Invalid request!')
//     });
//   }
// };











// router.patch('/')
// router.delete('/')
