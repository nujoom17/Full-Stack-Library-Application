const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    number: String,
    gender: String,
    password: String,
    authorization: String,
    date:{
        type: Date,
        default: Date.now
    }
})

const user=mongoose.model("userdata",userSchema)

module.exports=user;