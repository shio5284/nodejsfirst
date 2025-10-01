//middleware to check if the is logged in
var ensureAuth = function ensureAuthenticate(req, res, next){
    if(req.isAuthenticated()){
        next();

    } else{
        req.flash('info','You must be logged to see this page');
        res.redirect("/login")
    }
}
module.exports = {ensureAuthenticated: ensureAuth}