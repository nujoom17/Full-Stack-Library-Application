module.exports={
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next()
        }
        req.flash("error_msg","Authentication Error: Please log in to view this content!")
        res.redirect("/sign-in")
    }
}