var  express = require("express");
var router  =express.Router();



//third commit

router.use(function(req,res,next ){
    res.locals.currentUser = req.user;
    next();

});
router.use("/",require("./home"));

//to do add in  error and info

/* router.get("/",function(req, res){
res.render("Home/index");
});  */
  
module.exports = router;