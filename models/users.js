const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true, 'email not accepted']
    },
    phone:{
        type:Number,
        required:[true, 'username not accepted']
    },
    user:{
        type:String,
        required:[true, 'username not accepted']
    },
    password:{
        type:String,
        required:[true, 'password not accepted']
    }
})

module.exports = mongoose.model('User',userSchema);