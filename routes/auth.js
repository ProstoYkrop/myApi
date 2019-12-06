const router = require('express').Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation');

//User Models
const User = require('../models/auth');

//Register
router.post('/register', async (req,res) => {
    //lets validate
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check email
    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).send('Email exist');

    //bcrypt pass
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    //Check phone
    const phoneExist = await User.findOne({phone:req.body.phone});
    if(phoneExist) return res.status(404).send('Phone exist');

    //Create new user
    const user = new User({
        name:req.body.name,
        password: hashedPass,
        email: req.body.email,
        phone: req.body.phone
    });
    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    }catch (err) {
        res.status(404).send(err);
    }
});

//Login
router.post('/login', async (req,res) => {
    //lets validate
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already it the database
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Email is not found");

    //Check phone
    const phoneExist = await User.findOne({phone:req.body.phone});
    if(!phoneExist) return res.status(400).send('Phone is not found');

    //Check pass
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    //Json web token
    const tokenDi = config.get('mongoURI');
    const token = jwt.sign({_id: user._id}, tokenDi);
    res.header('auth-token', token).send(token);


});
//Route Update api/users
//access public
module.exports = router;