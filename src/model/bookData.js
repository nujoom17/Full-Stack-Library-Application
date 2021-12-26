const express=require("express")
const mongoose=require("mongoose")
mongoose.connect("mongodb+srv://userone:userone@ictakfiles.6h7ak.mongodb.net/LIBRARYAPP?retryWrites=true&w=majority")


const Schema=mongoose.Schema;

const bookSchema=new Schema({
    title: String,
    author: String,
    genre: String,
    image: String
})


let bookData=mongoose.model("bookdata",bookSchema)

module.exports=bookData;



