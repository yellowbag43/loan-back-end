const mongoose = require('mongoose');

//Here goes your schema 
const loanqueueSchema = mongoose.Schema( {
    userid       : { 
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'LoanUsers',
        required: true },
    amount       : { type : Number, required: true },
    logged       : { type : Date,   required: true }
 })

 loanqueueSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

loanqueueSchema.set('toJSON', {
    virtuals: true,
});

exports.Loanqueue = mongoose.model('LoanQueue', loanqueueSchema);