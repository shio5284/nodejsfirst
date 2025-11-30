var  express = require("express");
var router  =express.Router();



//third commit

router.use(function(req,res,next ){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");
    next();

});
router.use("/",require("./home"));
router.use("/posts",require("./post"));
router.use("/personalInfo",require("./personalInfo"));
//to do add in  error and info

/* router.get("/",function(req, res){
res.render("Home/index");
});  */
  
module.exports = router;