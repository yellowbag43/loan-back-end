const { User } = require('../models/user');
const { Ledger } = require('../models/ledger');

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { regexpToText } = require('nodemon/lib/utils');
const { Accounts } = require('../models/accounts');
const { request } = require('express');
require('dotenv/config');

const secret = process.env.secret;

getInterest = function(amt, account, days) {
    var amt_outstanding = outstanding(account,days)
    var interest = account.rate/100;

    var sum = (amt * interest * days )/365;
    sum = Math.round(sum);

    console.log("interest calculated "+sum )
    console.log("Amount outstanding "+amt_outstanding)
    
    if ( sum >= amt_outstanding )
    {
        console.log("Interest reached max "+ sum);
        sum = amt_outstanding-account.amount;
    }
    console.log("interest returning "+sum )

    return sum;
}

outstanding = function(account, days) { 
    var balance = account.amount - account.paid

    var interest = account.rate/100;

    var tot_interest = (balance * interest * days )/365;

//    this.outstandingAmount = this.outstandingAmount + Math.round(sum+balance)
    return Math.round(tot_interest+balance);
}


router.post(`/pay`, async  (req,res) => {
    if (!req.body.description)
        req.body.description="Paid" 
    
    const account = await Accounts.findById(req.body.accountid).select()
    if ( !account )
        res.status(500).send("Account Not found")

    const logged = new Date(req.body.logged)
    const noOfdays = getInterval( logged, account.logged);
    let interest = getInterest(req.body.amount, account, noOfdays);
    console.log("interest returned "+interest )

    let newEntry = new Ledger( {
        accountid   : req.body.accountid,
        amount      : req.body.amount,
        logged      : req.body.logged,
        description : req.body.description,
        days        : noOfdays,
        interest    : interest,
        reconciled  : false
    });

    newEntry.save().then((newSavedEntry=> {
        console.log("New entry saved in Ledger");
        res.status(201).json(newSavedEntry)         
    })).catch( (err) =>{
        console.log(err);
        res.status(500).send("Account Ledger Entry cannot be Created")
    });
})

router.get(`/`, async (req,res) => {

    const ledgers = await Ledger.find( { reconciled : false } )
                    .populate( {
                        path: 'accountid',
                        populate: {
                            path: 'userid',
                            populate: "name"
                        }   
                    })
                    .select('-passwordHash')

    if(!ledgers) {
        return res.status(500).json({ success: false})
    }
    res.send(ledgers);
})

router.get(`/account/:accountid`, async (req,res) => {

    const ledgers = await Ledger.find( { accountid : req.params.accountid,
                                         reconciled : true 
    })
                                .populate('accountid')

    if(!ledgers) {
        return res.status(500).json({ success: false})
    }
    res.send(ledgers);
})



router.get(`/:id`, async (req,res) => {

    const ledger = await Ledger.find({ accountid: req.params.id} );//'-passwordHash')

    if(!ledger) {
        return res.status(500).json({ success: false})
    }
    res.send(ledger);
})

router.delete('/:id', (req, res)=>{
    Ledger.findByIdAndRemove(req.params.id).then(loan =>{
        if(loan) {
            return res.status(200).json({success: true, message: 'the repayment entry is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "payment not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.put('/:id', async (req, res)=> {
    let ledger = await Ledger.findById( req.params.id );

    if(!ledger)
        return res.status(400).send('ERROR: ledger data cannot be Found!')

    let account = await Accounts.findById( ledger.accountid );
    
    if(!account)
        return res.status(400).send('ERROR: Account data cannot be Found!')

    let amt = (account.paid + req.body.amount) - ledger.interest;

    console.log("New paid "+ amt)

    account = await Accounts.findByIdAndUpdate( 
        ledger.accountid,
        {
            paid : amt
        }
    )

    if(!account)
        return res.status(400).send('ERROR: Account data cannot be Updated!')

    ledger = await Ledger.findByIdAndUpdate(
        req.params.id,
        {
            reconciled : req.body.reconciled
        },
        { new: true}
    )

    if(!ledger)
        return res.status(400).send('ERROR: ledger data cannot be changed!')

    res.send(ledger);
})

router.post(`/julian`, async (req,res) => {

    const date = new Date();
    const olddate = new Date();
    olddate.setFullYear(2022, 4, 1);
    console.log(date.toString())
    console.log(olddate.toString())
    let diff = getInterval(date, olddate);
    console.log("Difference "+diff)
    return res.status(200).json({success: true, message: date.toLocaleString()})
})


getInterval = function (date1, date2) {
    var difference = Date.UTC(date1.getYear(), date1.getMonth(), date1.getDate(), 0, 0, 0) - Date.UTC(date2.getYear(), date2.getMonth(), date2.getDate(), 0, 0, 0);
    var difdays = difference / (1000 * 60 * 60 * 24);
    return difdays;
};

module.exports = router;

