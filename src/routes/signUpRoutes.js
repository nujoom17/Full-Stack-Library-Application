const express=require("express")
const signUpRouter=express.Router()
const user=require("../model/userData")
const bcrypt=require("bcryptjs")


function router(nav){
   signUpRouter.get("/",(req,res)=>{
    res.render("sign-up",{nav})

       
   })

   signUpRouter.post("/",(req,res)=>{
      
       const {firstname,email,password,password2,gender,number,DOB,lastname,authorization}=req.body
       var errors=[]
       let emailRegex=/^([\w\_\-\.]+)@([\w\_\-\.]+)\.([a-z\-]{2,3})(\.[a-z]{2,3})?$/;
       let pwdRegex=/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}/
       let numberRegex=/^(\d{3})[\-\.\s]?(\d{3})[\-\.\s]?(\d{4})$/
       if(!firstname){
           errors.push({msg:"Name cannot be empty"})
       }
       if(!emailRegex.test(email)){
           errors.push({msg:"Email must be of valid format"})
       }
       if(!pwdRegex.test(password)){
           errors.push({msg:"Password must be at least eight characters and match specified criteria"})
       }
        if(password!=password2){
           errors.push({msg:"Passwords do not match"})
       }
       if(!numberRegex.test(number)){
           errors.push({msg:"Invalid Phone Number Format"})
       }
       if(!DOB){
           errors.push({msg:"Date of Birth should be mentioned"})
       }
       if(!authorization){
           errors.push({msg:"Account Authorization Role must be specified"})
       }
       if(errors.length>0){
        res.render("sign-up",{nav,errors,firstname,email,password,password2,number,DOB,lastname,gender,authorization})
       }
       else{ 
        
        user.findOne({email:email})
        .then(u=>{
            if(u){
                errors.push({msg:"User with the given E-mail is already registered"})
                 res.render("sign-up",{nav,errors,firstname,email,password,password2,number,DOB,lastname,authorization})
            }
            else{
               const newUser={
                        firstname:req.body.firstname,
                        lastname:req.body.lastname,
                        DOB:req.body.DOB,
                        gender:req.body.gender,
                        email:req.body.email,
                        number:req.body.number,
                        password:req.body.password,
                        authorization:req.body.authorization
                         }
            bcrypt.genSalt(16,(err,salt)=>bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err) throw err;
                newUser.password=hash
                let User=user(newUser)
                User.save().then(u=>{
                    req.flash("success_msg","Your account has been created successfully! Sign in to continue")
                    res.redirect("/sign-in")})
            }))    
            }
        })
       }
       console.log(req.body)
      
   })



    return signUpRouter
}

module.exports=router