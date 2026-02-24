var express = require("express");
var multer = require("multer");
var crypto = require("crypto");
var path = require("path");
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;
var Department = require("../../models/department");
var Designation = require("../../models/designation");
var Person = require("../../models/person");
var router = express.Router();
var PpmpHdr = require("../../models/ppmpHdr");
var User = require("../../models/user");
var PpmpDtl = require("../../models/ppmpDtl");
var UnitOfMeasurement = require("../../models/unitOfMeasurement");
var ProcMode = require("../../models/procMode");
var ProcStratTool = require("../../models/procStratTool");
router.use(ensureAuthenticated)



router.get("/", async function (req, res) {

     
  var filter =  { appCategoryItem:"General Item",
  fiscalYear:"2026",
procStage: "APP" }
//var ppmpDtl = await PpmpDtl.find(filter);
 const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const total = await PpmpDtl.countDocuments(filter);
  const ppmpDtl = await PpmpDtl.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });


var procStratTools = await ProcStratTool.find({});
  var unitOfMeasurements = await UnitOfMeasurement.find({});
  var procModes = await ProcMode.find({});


  const user = await User.findById(req.user._id);

  res.render("procApp/procApp", {
        
    ppmpDtls: ppmpDtl,
    unitOfMeasurements: unitOfMeasurements,
    procModes: procModes,
    procStratTools: procStratTools, 
     search: null,
    currentPage: page,
    totalPages: Math.ceil(total / limit) 
  });
}); 


router.post("/edit/:ppmpId", async function (req, res) {

  console.log("in side procapp edit")
 
  var ppmpDtlId = req.params.ppmpId;
  var selectedcategory = null;
   var unitOfMeasurements = await UnitOfMeasurement.find({});
  var procModes = await ProcMode.find({});
  const user = await User.findById(req.user._id);
  var ppmpDtledit = await PpmpDtl.findById(ppmpDtlId); 
 console.log(req.body.hiddenppmphdrIdnew);
  console.log("before",ppmpDtledit);


   
    ppmpDtledit.generalDescName=req.body.generalDescName, 

    ppmpDtledit.procLawCategoryId =req.body.appCategoryItem,
    ppmpDtledit.procurementMode =req.body.procMode,

   
    ppmpDtledit.appCriteriaBidEval =   req.body.criteriaForBidEval,
    ppmpDtledit.appProcStrac =req.body.procurementStrat,
 
    ppmpDtledit.startProc= req.body.startProc,
    ppmpDtledit.endProc = req.body.endProc,
    ppmpDtledit.quantity =req.body.quantity,
    ppmpDtledit.unitMeasurement  =req.body.unitOfMeasurement,
    ppmpDtledit.sourceOfFund  = req.body.sourceOfFound, 

    ppmpDtledit.estimatedBudget = req.body.estimatedBudget,
    
    ppmpDtledit.appRemarks=req.body.appRemarks

   console.log("after",ppmpDtledit);


  try {
  await ppmpDtledit.save();
   req.flash("info","Successfully Updated!!") ;
  }
  catch (err) {
    req.flash("error", err);
    console.log(err);
  
  }
  const selectedValue = req.body.hiddenppmphdrIdnew;
  console.log("hidenID",req.body.hiddenppmpdtlTypeedit);  
   /*  selectedValue != "null"?  ppmpDtl = await PpmpDtl.find({ ppmpHdrId: selectedValue }).sort({ createdAt: -1 }):"";
   selectedcategory =  PpmpDtl.procLawCategoryId
 */

 var filter =  { appCategoryItem:"General Item",
  fiscalYear:"2026",
procStage: "APP" }
//var ppmpDtl = await PpmpDtl.find(filter);
 const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const total = await PpmpDtl.countDocuments(filter);
  const ppmpDtl = await PpmpDtl.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });


var procStratTools = await ProcStratTool.find({});
  var unitOfMeasurements = await UnitOfMeasurement.find({});
  var procModes = await ProcMode.find({});



  res.render("procApp/procApp", {
        
    ppmpDtls: ppmpDtl,
    unitOfMeasurements: unitOfMeasurements,
    procModes: procModes,
    procStratTools: procStratTools, 
     search: null,
    currentPage: page,
    totalPages: Math.ceil(total / limit) 
  });

}) 




 
  








                 








module.exports = router;