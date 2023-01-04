const { Loanqueue } = require('../models/loanqueue');
const { User } = require('../models/user');
const { Accounts } = require('../models/accounts');

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv/config');

const secret = process.env.secret;

function generate_accountID()
{
    const id1 = String(Math.floor(Math.random()*1000))
    const id2 = String(Math.floor(Math.random()*1000))
    accountID =  id1+id2;
    return accountID;        
}

router.post(`/register`, async  (req,res) => {
    const regNow = Date.now();
    console.log("Date : "+regNow)

    let newLoan = new Loanqueue( {
        userid       : req.body.userid,
        amount       : req.body.amount,
        logged       : regNow
    });

    newLoan.save().then((newCreatedLoan=> {
        res.status(201).json(newCreatedLoan)
    })).catch( (err) =>{
        console.log(err);
        res.status(500).send("Loan requrest cannot be Created")
    });
})

router.get(`/`, async (req,res) => {

    const loans = await Loanqueue.find().populate('userid');//'-passwordHash')

    if(!loans) {
        res.status(500).json({ success: false})
    }
    res.send(loans);
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

router.post(`/approve/:id`, async  (req,res) => {
    const regNow = Date.now();

    const user = await User.findById(req.body.userid);//excluding this field

    if(!user) {
        res.status(500).json({ success: false})
    }
    
//    const customerID = user.customerID;
 //   console.log("Found Customer ID "+customerID)

    const loanAccount = generate_accountID();

    let newAccount = new Accounts( {
        userid      : req.body.userid,
        account     : loanAccount,
        amount      : req.body.amount,
        logged      : req.body.logged,
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

module.exports = router;

