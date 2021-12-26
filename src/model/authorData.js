// const express=require("express")
const mongoose=require("mongoose")
mongoose.connect("mongodb+srv://userone:userone@ictakfiles.6h7ak.mongodb.net/LIBRARYAPP?retryWrites=true&w=majority")

const Schema=mongoose.Schema
const authorSchema=new Schema({
    name: String,
    DOB: String,
    education: String,
    image: String
})

let authorData=mongoose.model("author",authorSchema)
module.exports=authorData;