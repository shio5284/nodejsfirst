var  express = require("express");
var router  =express.Router();



router.use("/users",require("./users"));

 //add 
module.exports = router;
