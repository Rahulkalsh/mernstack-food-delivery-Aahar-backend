const express = require("express")
const router = express.Router()
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const jwtSecret = "MyNameIsRahulKumharWhatAboutUIm$#";
router.post('/creatuser',
    [
        body('email','Invalide Email').isEmail(),
        body('name').isLength({ min: 5 }),
        body('password','Incorrect Password').isLength({ min: 5 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const salt = await bcrypt.genSalt(10);
        let secPassword =  await bcrypt.hash(req.body.password,salt);
        try {
            const newUser = await User.create({
                name: req.body.name,
                password: secPassword,
                email: req.body.email,
                location: req.body.location
            });
            res.json({ success: true, user: newUser });
        } catch (error) {
            console.error(error);
            res.json({ success: false, error: error.message || "An error occurred" });
        }
    });
 router.post('/loginuser',
 [
    body('email','Invalide Email').isEmail(),
    body('password','Incorrect Password').isLength({ min: 5 })
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let email = req.body.email;
        try {
            let userData = await User.findOne({email});
            if(!userData){
                return res.status(400).json({ errors:"Try Login with correct values" });
            }
            const pwdCompare = await bcrypt.compare(req.body.password,userData.password);
            if(!pwdCompare){
                return res.status(400).json({ errors:"Enter the correct password !" });
            }
            const data = {
                user:{
                    id:userData.id
                }
            }
            const authToken = jwt.sign(data,jwtSecret)
            return res.json({success: true,authToken:authToken });
        } catch (error) {
            console.error(error);
            res.json({ success: false, error: error.message || "An error occurred" });
        }
    });
module.exports = router;