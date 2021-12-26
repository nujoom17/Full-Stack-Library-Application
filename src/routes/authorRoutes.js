const express=require("express")
const authorRouter=express.Router()
const authorData=require("../model/authorData")
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

authorRouter.get("/",(req,res)=>{
    authorData.find()
    .then(function(authors){
          res.render("authors",{nav,title,authors})
    })

})

authorRouter.get("/:id",(req,res)=>{
    const id=req.params.id
    authorData.findOne({_id:id})
    .then(function(author){
     res.render("author",{nav,title,author})
    })
})

authorRouter.delete("/:id",ensureAuthorized,(req,res)=>{
    const id=req.params.id
    authorData.findByIdAndRemove({_id:id},req.body,function(err,data){
        if(!err){
            console.log("deleted")
             req.flash("success_msg_delete","The requested entry has been successfully deleted")
            res.redirect("/authors")
        }
    })
})

authorRouter.put("/:id",ensureAuthorized,upload.single("image"),(req,res)=>{
     let item={
           name:req.body.name,
           DOB:req.body.DOB,
           education:req.body.education,
           image:req.file.filename
       }
    authorData.findByIdAndUpdate(req.params.id,item,(err,data)=>{
        if(!err){
             req.flash("success_msg","The requested entry has been modified")
            res.redirect("/authors")
        }
    })

})

return authorRouter
}

module.exports=router