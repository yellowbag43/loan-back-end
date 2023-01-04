const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv/config');

const secret = process.env.secret;

function generate_customerID()
{
    const id1 = String(Math.floor(Math.random()*1000))
    const id2 = String(Math.floor(Math.random()*1000))
    customerID =  id1+id2;
    return customerID;        
}

router.post(`/register`, async  (req,res) => {

    let userID = req.body.user.toLowerCase();

    let userExists = await User.exists( { user: userID.trim() })

    if ( userExists )
        return res.status(500).send('User name already Exists!')       
    else {
        userExists = await User.exists( { email: req.body.email })
        if ( userExists )
            return res.status(500).send( "Email already exits!"  )       
    }

    const regNow = Date.now();
    console.log("Date : "+regNow)

    let newUser = new User( {
        user         : userID.trim(),
        name         : req.body.name,
        passwordHash : bcrypt.hashSync(req.body.password,10),
        email        : req.body.email,
        mobile       : req.body.mobile,
        newuser      : true,
        checkedIn     : regNow,
        customerID   : generate_customerID(),
    });

    newUser.save().then((newCreatedUser=> {
        res.status(201).json(newCreatedUser)
    })).catch( (err) =>{
        console.log(err);
        res.status(500).send("User cannot be Created")
    });
})

router.get(`/`, async (req,res) => {

    const users = await User.find().select();//'-passwordHash')

    if(!users) {
        res.status(500).json({ success: false})
    }
    res.send(users);
})

router.get(`/:id`, async (req,res) => {

    const user = await User.findById(req.params.id);//excluding this field

    if(!user) {
        res.status(500).json({ success: false})
    }
 
    res.send(user);
})

router.get(`/newusers`, async (req,res) => {

    const users = await User.find({ newuser: true });//'-passwordHash')

    if(!users) {
        res.status(500).json({ success: false})
    }
    res.send(users);
})

router.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.post(`/login`, async (req, res) => {

    let userID = req.body.user.toLowerCase();
    console.log("userID "+userID)

    const user = await User.findOne( {user: userID.trim()})
    
    console.log("user "+user)

    if (!user) {
        return res.status(400).send( {  success: false, message: req.body.user+"User Doesn't Exits!"});
    }

    if (user.newuser)
        return res.status(400).send( {  success: false, message:"Contact Administrator for Approval"});

    if (!req.body.password)
        return res.status(400).send( {  success: false, message:"Invalid Password"});

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const JWTtoken = jwt.sign(
            {
                userId : user.id
            },
            secret,   //secret key
            {
                expiresIn : "3h"
            }
        )
        res.status(200).send( { id: user.id, key: JWTtoken} );
    }else {
        return res.status(400).send( {  success: false, message:'Invalid User/password'} );
    }
})

router.put('/approveuser/:id', async (req, res)=> {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            newuser : req.body.newuser
        },
        { new: true}
    )

    if(!user)
        return res.status(400).send('ERROR: user data cannot be changed!')

    res.send(user);
})


module.exports = router;

