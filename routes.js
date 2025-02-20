var express = require ("express");
var router = express.Router() ;

router.get("/",function (req,res){
    
    console.log("Hello In on the Start ");
     res.render ("index")
});


router.get("/about",function (req,res){
    
    console.log("Hello In on about ");
     res.render ("about")
});


router.get("/login",function (req,res){
    
    console.log("Hello In on about ");
     res.render ("login")
});


module.exports = router;
