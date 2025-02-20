var  express = require("express");
var router  =express.Router();






router.get("/",function(req, res){
    res.json("this my json ");
});

  
module.exports = router;