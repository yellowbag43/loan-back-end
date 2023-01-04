const { User } = require('../models/user');
const { Accounts } = require('../models/accounts');

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv/config');

const secret = process.env.secret;

router.get(`/all`, async (req,res) => {
    const account = await Accounts.find().populate('userid');//'-passwordHash')

    if(!account) {
        return res.status(500).json({ success: false})
    }
    res.send(account);
})

router.get(`/:id`, async (req,res) => {
    const accstatus = 'open'
    console.log("get only open")

    const account = await Accounts.find({ userid: req.params.id, status : accstatus } );//.populate('userid');//'-passwordHash')

    if(!account) {
        return res.status(500).json({ success: false})
    }
    res.send(account);
})

router.delete('/:id', (req, res)=>{
    Loanqueue.findByIdAndRemove(req.params.id).then(loan =>{
        if(loan) {
            return res.status(200).json({success: true, message: 'the loan is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "loan not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

/* router.post(`/approve/:id`, async  (req,res) => {
    const regNow = Date.now();

    const user = await User.findById(req.body.userid);//excluding this field

    if(!user) {
        res.status(500).json({ success: false, message: "user doesn't exits!"})
    }
    
//    const customerID = user.customerID;
 //   console.log("Found Customer ID "+customerID)

    const loanAccount = generate_accountID();

    let newAccount = new Accounts( {
        userid      : req.body.userid,
        account     : loanAccount,
        amount      : req.body.amount,
        logged      : regNow,
        type        : req.body.type,
        rate        : req.body.rate,
        paid        : 0
    });

    newAccount.save().then((newCreatedAccount=> {
        res.status(201).json(newCreatedAccount)
        Loanqueue.findByIdAndRemove(req.params.id).then(loan =>{
            if(loan) {
                console.log('Loanqueue is cleared for this request!')
            } else {
                console.log('Loanqueue unable to clear for '+req.params.id); }
        }).catch(err=>{
           return res.status(500).json({success: false, error: err}) 
        })
            
    })).catch( (err) =>{
        console.log(err);
        res.status(500).send("Account cannot be Created")
    });
})


 */router.put("/:id", async (req, res) => {
    const account = await Accounts.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }
    );
  
    if (!order) return res.status(400).send("the order cannot be update!");
  
    res.send(order);
  });


module.exports = router;

