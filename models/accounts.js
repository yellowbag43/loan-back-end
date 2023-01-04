const mongoose = require('mongoose');

//Here goes your schema 
const accountSchema = mongoose.Schema( {
    userid       : { 
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'LoanUsers',
        required: true },
    account      : { type : String, required: true },
    amount       : { type : Number, required: true },
    logged       : { type : Date,   required: true },
    type         : { type : String, required: true },
    rate         : { type : Number },
    paid         : { type : Number },
    status       : { type: String, required: true}
 })

accountSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

accountSchema.set('toJSON', {
    virtuals: true,
});

exports.Accounts = mongoose.model('Accounts', accountSchema);