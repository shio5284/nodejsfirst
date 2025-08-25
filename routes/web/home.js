var  express = require("express");
var router  =express.Router();
var passport =require("passport")
var bodyParser = require("body-parser");
var User = require ("../../models/user");

//to do add in  error and info
//router.use("/",require ("./home"));

router.get("/",function(req, res){
    res.render("Home/index");
});
router.get("/home",function(req, res){
    console.log("you hit home")
    res.render("Home/home");
});
 
router.get("/about",function(req, res){

    res.render("Home/about");
    });
router.get("/login",function(req, res){
      
        res.render("Home/login");
        });


        router.post("/login" ,passport.authenticate("login",{
            successRedirect:"/",
            failureRedirect:"/login",
            failureFlash:true
          }));   



            router.get('/logout', function(req, res, next) {
                req.logout(function(err) {
                  if (err) { return next(err); }
                  res.redirect('/');
                });
              });


router.get("/signup",function(req, res){
            
            res.render("Home/signup");
            });

      
  

router.post("/signup",function(req,res,next)
{
             
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
            
                   
    User.findOne({ email: email})
      .then(user => {
                  if (user) {
                            req.flash("error", "There already an account with this email");
                            return res.redirect ("/signup");
                          }
                  else {
                      var newUser =new User ({
                      username:username,
                      password:password,
                      email:email
                       });
                        

                       async function f() {

  try {
    let response = await newUser.save()

 next();
  } catch(err) {
    // catches errors both in fetch and response.json
    console.log(err);
  }
}

f();



                      }
          })
        
          

          .catch(error => {
          console.error('Error finding user:', error);
          }); 
                
                
                    
} ,passport.authenticate("login",{
                  successRedirect:"/",
                  failureRedirect:"/signup",
                  failureFlash:true
                }) );

   
              
module.exports = router;