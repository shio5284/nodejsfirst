var  express = require("express");
var router  =express.Router();



//third commit
router.use("/",require("./home"));

//to do add in  error and info

/* router.get("/",function(req, res){
res.render("index");
}); */
  
module.exports = router;