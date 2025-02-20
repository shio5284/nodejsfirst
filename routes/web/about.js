var  express = require("express");
var router  =express.Router();




//to do add in  error and info
//router.use("/",require ("./home"));

router.get("/",function(req, res){
    res.render("Home/index");
});
router.get("/about",function(req, res){
res.render("Home/about");
});

router.get("/home",function(req, res){
    res.render("Home/about");
    });
router.get("/login",function(req, res){
    res.render("Home/login");
    });
module.exports = router;