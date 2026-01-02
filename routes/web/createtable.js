var express = require("express");
var multer = require("multer");
var crypto = require("crypto");
var path = require ("path");
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;
var Department = require("../../models/department");
var Designation = require("../../models/designation");
var Person = require("../../models/person");
var router =express.Router();
var User = require ("../../models/user");




router.get("/", async function(req, res){
 
 console.log("you are in table");
var newtable = new ppmpType({
        ppmpTypedesc: "Indicative",
              });
     
  console.log(newtable);

 var table = await newtable.save();
 

})
  

module.exports = router;