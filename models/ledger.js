const mongoose = require('mongoose');

//Here goes your schema 
const ledgerSchema = mongoose.Schema( {
    accountid: { 
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'Accounts',
        required: true },
    amount       : { type : Number, required: true },
    logged       : { type : Date,   required: true },
    description  : { type : String, required: true },
    days         : { type : Number },
    interest     : { type : Number },
    reconciled   : { type : Boolean, required: true }
 })

 ledgerSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

ledgerSchema.set('toJSON', {
    virtuals: true,
});

exports.Ledger = mongoose.model('Ledger', ledgerSchema);