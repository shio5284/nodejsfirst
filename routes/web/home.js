var  express = require("express");
var router  =express.Router();
var passport =require("passport")



//to do add in  error and info
//router.use("/",require ("./home"));

router.get("/",function(req, res){
    res.render("Home/index");
});
router.get("/home",function(req, res){
res.render("Home/home");
});
  
router.get("/about",function(req, res){
    res.render("Home/about");
    });

    router.get("/login",function(req, res){
        res.render("Home/login");
        });

        router.get("/signup",function(req, res){
            res.render("Home/signup");
            });



            router.post("/signup",function*(req,res,next){

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
module.exports = router;