const express=require("express")
const authorData=require("../model/authorData")
const addAuthorRouter=express.Router()
const multer=require("multer")
const path=require("path")


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
    addAuthorRouter.get("/",(req,res)=>{
        res.render("addAuthor",{nav,title})
    })
   addAuthorRouter.post("/add",upload.single("image"),(req,res)=>{
       let item={
           name:req.body.name,
           DOB:req.body.DOB,
           education:req.body.education,
           image:req.file.filename
       }
       let author=authorData(item)
       author.save()
        req.flash("success_msg","New Author has been added successfully")
       res.redirect("/authors")
   })
  return addAuthorRouter

}

module.exports=router