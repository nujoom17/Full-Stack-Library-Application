const express=require("express")
const bookData=require("../model/bookData")
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


const addBkRouter=express.Router()

function router(nav,title){
addBkRouter.get("/",(req,res)=>{
    res.render("addBk",{title,nav})
})

addBkRouter.post("/add",upload.single("image"),(req,res)=>{
    let item={
    title:req.body.title,
    author:req.body.author,
    genre:req.body.genre,
    image:req.file.filename
    }
    console.log(req.body)
    let book=bookData(item)
    book.save()
     req.flash("success_msg","New Book has been added successfully")
    res.redirect("/books")
    
})

return addBkRouter
}

module.exports=router