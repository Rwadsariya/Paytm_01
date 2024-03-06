import mongoose, { Schema } from 'mongoose';

mongoose.connect("mongodb://localhost:27017/paytm")

const userSchema =  new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
})

const AccountSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // place holder for user
        ref: 'User', //Reference the user Id in User Table..(database)
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const User = mongoose.model('User',userSchema);
const Account = mongoose.model('Amount', AccountSchema);

module.exports = {
    User,
    Account
}