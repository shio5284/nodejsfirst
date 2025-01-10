var express = require ("express");
var router = express.Router() ;

router.get("/",function (req,res){
    
    console.log("Hello In on the Start ");
    // res.render ("index")
});

module.exports = router;
