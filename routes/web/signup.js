var  express = require("express");
var router  =express.Router();
var passport =require("passport")

var User = require ("../../models/user");




//to do add in  error and info
//router.use("/",require ("./home"));

router.get("/",function(req, res){
    res.render("Home/index");
});
router.get("/register",function(req, res){
res.render("Home/register");
});

router.post("/register",function*(req,res,next){

var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({email}, function (err,user){

        if(err){ return next (err); }
        if(user){
            req.flash("error", "There already an account with this email");
            return res.redirect ("/register");
        } 
        var newUser =new User ({
            username:username,
            password:password,
            email:email
        });
        newUser.save(next);

    });
 

},  passport.authenticate("login",{
    successRedirect:"/",
    failureRedirect:"/sigmup",
    failureFlash:true
}));
