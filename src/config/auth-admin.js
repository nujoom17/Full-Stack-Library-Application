module.exports={
    ensureAuthorized: function(req,res,next){
        if(req.isAuthenticated() && req.user.authorization=="admin"){
            return next()
            }
        req.flash("access_error","Sorry! You are not authorized to add/modify/delete any data unless you have admin privileges.")
        res.redirect("/home")
    }
}