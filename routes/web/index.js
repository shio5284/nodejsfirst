var  express = require("express");
var router  =express.Router();



//third commit

router.use(function(req,res,next ){
    res.locals.currentUser = req.user;
    res.locals.currentRoute ="procApp"
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");
    next();

});
router.use("/",require("./home"));
router.use("/posts",require("./post"));
router.use("/main",require("./main"));
//router.use("/personalInfo",require("./personalInfo"));
//router.use("/ppmp",require("./ppmp"));
//router.use("/ppmpDtl",require("./ppmpdtl"));
router.use("/procapp",require("./procapp"));
//router.use("/ppmpItem",require("./ppmpItem"));
//router.use("/ppmpPr",require("./ppmpPr"));
//to do add in  error and info


  
module.exports = router;