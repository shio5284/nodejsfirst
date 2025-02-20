var passport = require ("passport");
var localStrategy = require("passport-local").Strategy;

var User = require ("./models/user");

module.exports = function(){
    //turns a  user object into an id
    passport.serializeUser(function(user,done){
        //serializing the user
        done(null, user.id);
    });
    // turns the id into a user bojct
    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user);
        });
    });
passport.use("register", new localStrategy({
    usernameField:'email',
    passwordField: 'password'
}, function(email,password,done){
    user.findOne({email:email},function (err,user){
        if(err){return done(err);}
        if (!user){
            return done(null,false,{message:"No user has that email"});
        }
        user.checkPassword(password, function(err,isMatch){
            if(err){return done(err);}
            if (isMatch){
                return done(null,user);
            } else{
                return done(null,false,{message:"Invalid password"});
            }
        })
    })
}));
}
