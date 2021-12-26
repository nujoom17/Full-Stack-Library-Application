const express=require("express")
const res = require("express/lib/response")
const passport=require("passport")
const signInRouter=express.Router()


function router(nav){
   signInRouter.get("/",(req,res)=>{
       res.render("sign-in",{nav})
   })

   
    signInRouter.post("/", (req, res, next) => {
    passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/sign-in",
    failureFlash: true
    })(req, res, next);
    });


    return signInRouter
}

module.exports=router