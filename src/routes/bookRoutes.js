const express=require("express")
const booksRouter=express.Router()
const bookData=require("../model/bookData")
const {ensureAuthorized}=require("./../config/auth-admin")
const multer=require("multer")
const path=require("path")
const { redirect } = require("express/lib/response")

const storage=multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"./public/images/")
    },
    filename: (req,file,cb)=>{
        console.log(file)
        cb(null,Date.now()+path.extname(file.originalname))
    }
})
const upload=multer({storage: storage})


function router(nav,title){

booksRouter.get("/",(req,res)=>{
    bookData.find()
    .then(function(books){
        res.render("books",{books,nav,title})
    })
    
})


booksRouter.get("/:id",(req,res)=>{
    const id=req.params.id;
    bookData.findOne({_id:id})
    .then(function(bk){
        console.log(req.params.id)
      res.render("bk",{bk,nav,title})
    })
    
})

booksRouter.delete("/:id",ensureAuthorized,(req,res)=>{
    const id=req.params.id
    bookData.findByIdAndRemove({_id:id},req.body,function(err,data){
        if(!err){
            console.log("deleted")
              req.flash("success_msg_delete","The requested entry has been successfully deleted")
            res.redirect("/books")
        }
    })
})
booksRouter.put("/:id",ensureAuthorized,upload.single("image"),(req,res)=>{
    let item={
            title:req.body.title,
            author:req.body.author,
            genre:req.body.genre,
            image:req.file.filename
    }
    bookData.findByIdAndUpdate(req.params.id,item,(err,data)=>{
        if(!err){
            console.log("modified")
            req.flash("success_msg","The requested entry has been modified")
            res.redirect("/books")
        }
    })

})
return booksRouter
}
module.exports=router;

