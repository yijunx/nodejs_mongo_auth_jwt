const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken')
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');


router.post('/register', async (req, res) => {

    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // checking if the user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('email is already there');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // create the user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    // make user into db
    try {
        const userCreated = await user.save();
        res.status(201).send({user: user._id});
    } catch (err) {
        res.status(400).send(err);
    }
});


router.post('/login', async (req, res) => {

    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // checking if the email exists
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('email or password is wrong');
    // if password is correct
    try {
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).send('email or password is wrong');
        // create and assign the token
        token = jwt.sign({_id: user._id, email: user.email}, process.env.TOKEN_SECRET)
        res.header('auth-token', token).send(token);
    } catch (err) {
        res.status(400).send(err);
    }
    
    // now email/password is ok
});


module.exports = router