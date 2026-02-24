var express = require("express");
var multer = require("multer");
var crypto = require("crypto");
var path = require("path");
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;
var Department = require("../../models/department");

var Person = require("../../models/person");
var router = express.Router();
var PpmpHdr = require("../../models/ppmpHdr");
var User = require("../../models/user");
var PpmpDtl = require("../../models/ppmpDtl");
var UnitOfMeasurement = require("../../models/unitOfMeasurement");
var ProcMode = require("../../models/procMode");
router.use(ensureAuthenticated)




router.get("n", async function (req, res) {

 const ppmpDtl = await PpmpDtl.find().sort({ createdAt: -1 });
  const user = await User.findById(req.user._id);
  var personId = user.personId;
  var person = await Person.findById(personId);
  var departmentId = null;
  var departmentdesc = null;
  if (person != null) {
    departmentId = person.departmentId;    
  }
  var department = await Department.findById(departmentId)
  department == null ? departmentdesc = null : departmentdesc = department.description;

var ppmpHdr = await PpmpHdr.find({"departmentId":departmentId})


  res.render("ppmp/ppmp", { departmentId: departmentId, personId: personId, departmentdesc: departmentdesc, ppmpHdrs:ppmpHdr, selectedValue :null, ppmpDtls:ppmpDtl});
});


router.post("/new", async function (req, res) {
var  departments =  await Department.find({});
var unitOfMeasurements = await UnitOfMeasurement.find({});
var procModes = await ProcMode.find({});
   const ppmpDtl = await PpmpDtl.find().sort({ createdAt: -1 });
   const selectedValue = req.body.hiddenppmphdrId; // 'mySelect' is the name attribute of your <select>
   
``
  const user = await User.findById(req.user._id);
  var personId = user.personId;
  var person = await Person.findById(personId);
  var departmentId = null;
  var departmentdesc = null;
  if (person != null) {
    departmentId = person.departmentId;    
  }
  var department = await Department.findById(departmentId)
  department == null ? departmentdesc = null : departmentdesc = department.description;

var ppmpHdr = await PpmpHdr.find({"departmentId":departmentId})
  
  res.render("ppmpDtl/ppmpDtlNew",{ departmentId: departmentId, personId: personId, departmentdesc: departmentdesc, ppmpHdrs:ppmpHdr, selectedValue :selectedValue, ppmpDtls:ppmpDtl, unitOfMeasurements:unitOfMeasurements,procModes:procModes});

});
     



router.post("/saveppmpDtl", async function (req, res) {

  const user = await User.findById(req.user._id);



  var newPpmpDtl = new PpmpDtl({

   ppmpHdrId:req.body.hiddenppmphdrIdnew,
    
    generalDescName:req.body.generalDescName,
    procLawCategoryId :req.body.ppmpCategory,
    quantity :req.body.quantity,
    unitMeasurement  :req.body.unitOfMeasurement,
    procurementMode :req.body.procMode,
    preProcCon:req.body.estimatedBudget>=5000000? true :false,
    status:true,
    startProc: req.body.startProc,
    endProc: req.body.endProc,
    expectedDelivery:req.body.expectedDelivery,
    sourceOfFund : req.body.sourceOfFound, 
    estimatedBudget:req.body.estimatedBudget,
    attachedSupportingDocs:req.body.attachedSupportingDocs,
    remarks:req.body.remarks
 });



  //console.log(newPpmpDtl); 
  /* console.log(req.body.versionNo); 
  console.log( req.body.fiscalYear); 
  console.log( req.body.ppmptype); */

  try {
    var ppmpnew = await newPpmpDtl.save();
  }
  catch (err) {
    req.flash("error", err);
    console.log(err);
    console.log("error insaving ppmphdr");
  }

   const ppmpDtl = await PpmpDtl.find().sort({ createdAt: -1 });
   const selectedValue = req.body.designation; // 'mySelect' is the name attribute of your <select>
   console.log('Selected Value:', selectedValue);

  // // Now you can use 'selectedValue' to perform database queries or other actions
  // // For example, render another EJS page with the selected value
  // res.render("ppmp/ppmp", { selectedValue: selectedValue });

  var personId = user.personId;
  var person = await Person.findById(personId);
  var departmentId = null;
  var departmentdesc = null;
  if (person != null) {
    departmentId = person.departmentId;    
  }
  var department = await Department.findById(departmentId)
  department == null ? departmentdesc = null : departmentdesc = department.description;

var ppmpHdr = await PpmpHdr.find({"departmentId":departmentId})


 res.render("ppmp/ppmp", { departmentId: departmentId, personId: personId, departmentdesc: departmentdesc, ppmpHdrs:ppmpHdr, selectedValue: selectedValue, ppmpDtls:ppmpDtl});
})


router.post("/dgdgd",  async function (req, res) {

   const ppmpDtl = await PpmpDtl.find().sort({ createdAt: -1 });
   const selectedValue = req.body.designation; // 'mySelect' is the name attribute of your <select>
   console.log('Selected Value:', selectedValue);

  // // Now you can use 'selectedValue' to perform database queries or other actions
  // // For example, render another EJS page with the selected value
  // res.render("ppmp/ppmp", { selectedValue: selectedValue });
  const user = await User.findById(req.user._id);
  var personId = user.personId;
  var person = await Person.findById(personId);
  var departmentId = null;
  var departmentdesc = null;
  if (person != null) {
    departmentId = person.departmentId;    
  }
  var department = await Department.findById(departmentId)
  department == null ? departmentdesc = null : departmentdesc = department.description;

var ppmpHdr = await PpmpHdr.find({"departmentId":departmentId})


 res.render("ppmp/ppmp", { departmentId: departmentId, personId: personId, departmentdesc: departmentdesc, ppmpHdrs:ppmpHdr, selectedValue: selectedValue, ppmpDtls:ppmpDtl});
// res.render("form", { selectedValue: selectedValue });
 //res.redirect("/ppmp", { departmentId: departmentId, personId: personId, departmentdesc: departmentdesc, ppmpHdrs:ppmpHdr });

});
/* 
router.get("/:ppmpHdrId", async function(req, res){
  const ppmphdr = await PpmpHdr.findById(req.params.postId);  
    res.render("ppmp/ppmpDts",{ppmpDtls:[]});

  }) */






















module.exports = router;