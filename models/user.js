const mongoose = require('mongoose');

//Here goes your schema 
const userSchema = mongoose.Schema( {
    user         : { type : String, required: true },
    name         : { type : String, required: true },
    email        : { type : String, required: true },
    passwordHash : { type : String, required: true },
    mobile       : { type : String, required: false},
    newuser      : { type : Boolean, default: false},
    checkedIn    : { type : Date,   required: true },
    customerID   : { type : String, required: true },

 })

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model('LoanUsers', userSchema);