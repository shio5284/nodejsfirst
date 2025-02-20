var  express = require("express");
var router  =express.Router();




//to do add in  error and info
//router.use("/",require ("./home"));

router.get("/",function(req, res){
    res.render("/Home/index");
});
router.get("/info",function(req, res){
res.render("/Home/info");
});
  
module.exports = router;