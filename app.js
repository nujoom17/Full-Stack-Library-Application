const express=require("express")
const flash=require("connect-flash")
const session=require("express-session")
const { connect } = require("mongoose")
const passport = require("passport")



const router=express.Router()
const app=express()
app.use(express.urlencoded({extended:true}))
app.use(express.static("./public"))


require("./src/config/passport")(passport)
const {ensureAuthenticated}=require("./src/config/auth")
const {ensureAuthorized}=require("./src/config/auth-admin")

let title="Library Application"
let nav=[
    {link:"/home",name:"Home"},
    {link:"/books",name:"Books"},
    {link:"/authors",name:"Authors"},
    {link:"/addBk",name:"Add Book"},
    {link:"/addAuthor",name:"Add Author"},
    {link:"/sign-out",name:"Sign Out"}
    ]

const booksRouter=require("./src/routes/bookRoutes")(nav,title)
const authorRouter=require("./src/routes/authorRoutes")(nav,title)
const addBkRouter=require("./src/routes/addBkRoutes")(nav,title)
const signUpRouter=require("./src/routes/signUpRoutes")(nav)
const signInRouter=require("./src/routes/signInRoutes")(nav)
const addAuthorRouter=require("./src/routes/addAuthorRoutes")(nav,title)



app.use(session({
    secret:"secret",
    resave: true,
    saveUninitialized:true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req,res,next)=>{
    res.locals.success_msg=req.flash("success_msg");
    res.locals.error_msg=req.flash("error_msg")
    res.locals.error=req.flash("error")
    res.locals.access_error=req.flash("access_error")
    res.locals.success_msg_delete=req.flash("success_msg_delete");
    next()
})

app.set("view engine","ejs")
app.set("views","./src/views")



app.use( function( req, res, next ) {
    
    if ( req.query._method == 'DELETE' ) {
        req.method = 'DELETE';
        req.url = req.path;
    }       
    next(); 
});
app.use( function( req, res, next ) {
    
    if ( req.query._method == 'PUT' ) {
        req.method = 'PUT';
        req.url = req.path;
    }       
    next(); 
});
app.use("/books",ensureAuthenticated,booksRouter)
app.use("/authors",ensureAuthenticated,authorRouter)
app.use("/addBk",ensureAuthorized,addBkRouter)
app.use("/addAuthor",ensureAuthorized,addAuthorRouter)
app.use("/sign-up",signUpRouter)
app.use("/sign-in",signInRouter)



app.get("/",(req,res)=>{
    res.render("index",{
        title,nav
    })
})
app.get("/home",ensureAuthenticated,(req,res)=>{
    console.log(req.user.authorization)
    res.render("home",{title,nav,name:req.user.firstname,role:req.user.authorization})
})

app.get("/sign-out",(req,res)=>{
    req.logOut();
    req.flash("success_msg","You have been logged out successfully.")
    res.redirect("/sign-in")
})





let port=process.env.PORT||8080
app.listen(port)


