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
router.use(ensureAuthenticated)



// first load
router.get("/", async function (req, res) {

var selectedValue =req.params.postId;
 
selectedValue != undefined?  selectedValue =req.params.postId: "null";

console.log(selectedValue);
 const page = parseInt(req.query.page) || 1;
  const limit = 5; // records per page
  const search = req.query.search || '';
var query = null;
  if (search== ''){
query={ppmpHdrId: selectedValue}
  }
  else{

console.log("search"+ search);
  query = {
     ppmpHdrId: selectedValue,
    $or: [
      
      { sourceOfFund: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { position: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } }
    ]
  }; }

  const totalPpmpDtl = await PpmpDtl.countDocuments(query);
  const ppmpDtl = await PpmpDtl.find(query)
    .skip((page - 1) * limit)
    .limit(limit);
  var unitOfMeasurements = await UnitOfMeasurement.find({});
  var procModes = await ProcMode.find({}); 
  var selectedcategory = null;  
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

  var ppmpHdr = await PpmpHdr.find({ "departmentId": departmentId, fiscalYear: 2026 })

  res.render("ppmp/ppmp", {
    departmentId: departmentId,
    personId: personId,
    departmentdesc: departmentdesc,
    ppmpHdrs: ppmpHdr,
    selectedValue: selectedValue,
    ppmpDtls: ppmpDtl,
    unitOfMeasurements: unitOfMeasurements,
    procModes: procModes,
    selectedcategory:selectedcategory,
    search,
    currentPage: page,
    totalPages: Math.ceil(totalPpmpDtl / limit)
  });
});

router.get("/:postId", async function(req, res){
 
 var selectedValue =req.params.postId;
selectedValue != undefined?  selectedValue =req.params.postId: null ;


console.log("selected value " + selectedValue) ;
  const page = parseInt(req.query.page) || 1;
  
  const limit = 5; // records per page
  const search = req.query.search || '';
var query = null;
  if (search== ''){
query={ ppmpHdrId: selectedValue }
  }
  else{

  //const query = {procLawCategoryId: "Goods" };
console.log("search"+ search);
  query = {
      ppmpHdrId: selectedValue ,
    $or: [
      
      { sourceOfFund: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { position: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } }
    ]
  }; }

  const totalPpmpDtl = await PpmpDtl.countDocuments(query);
  const ppmpDtl = await PpmpDtl.find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  
  
     var unitOfMeasurements = await UnitOfMeasurement.find({});
  var procModes = await ProcMode.find({});

 
console.log("selected value " + selectedValue) ;
 
 //if (selectedValue!="null"){
    
 //ppmpDtl = await PpmpDtl.find({ ppmpHdrId: selectedValue }).sort({ createdAt: -1 }); }
  const user = await User.findById(req.user._id);
  var personId = user.personId;
  var person = await Person.findById(personId);
  var departmentId = null;
  var departmentdesc = null;
 var selectedcategory =   ppmpDtl.procLawCategoryId;
  if (person != null) {
    departmentId = person.departmentId;
  }
  var department = await Department.findById(departmentId)
  department == null ? departmentdesc = null : departmentdesc = department.description;

  var ppmpHdr = await PpmpHdr.find({ "departmentId": departmentId })

  res.render("ppmp/ppmp", {
    departmentId: departmentId,
    personId: personId,
    departmentdesc: departmentdesc,
    ppmpHdrs: ppmpHdr,
    selectedValue: selectedValue,
    ppmpDtls: ppmpDtl,
    unitOfMeasurements: unitOfMeasurements,
    procModes: procModes,
    selectedcategory:selectedcategory,
    search,
    currentPage: page,
    totalPages: Math.ceil(totalPpmpDtl / limit)

  }); 
  })





//select change
router.post("/", async function (req, res) {
  var unitOfMeasurements = await UnitOfMeasurement.find({});
  var procModes = await ProcMode.find({});
  var ppmpDtl = [];
  const selectedValue = req.body.designation;
  if (selectedValue != "null") { ppmpDtl = await PpmpDtl.find({ ppmpHdrId: selectedValue }).sort({ createdAt: -1 }); }
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

   var ppmpHdr = await PpmpHdr.find({ "departmentId": departmentId, fiscalYear: 2026 })
  res.render("ppmp/ppmp", {
    departmentId: departmentId,
    personId: personId,
    departmentdesc: departmentdesc,
    ppmpHdrs: ppmpHdr,
    selectedValue: selectedValue,
    ppmpDtls: ppmpDtl,
    unitOfMeasurements: unitOfMeasurements,
    procModes: procModes

  });

});


router.get("/createppmphdr", async function (req, res) {
  const user = await User.findById(req.user._id);
  var personId = user.personId;
  var person = await Person.findById(personId);
  var departmentId = null;
  var departmentdesc = null;
  if (person != null) {
    departmentId = person.departmentId;
  }
  var department = await Department.findById(departmentId)
  department == null ? departmentdesc = null : departmentdesc = department.description
  res.render("ppmp/ppmpHdr", { departmentId: departmentId, personId: personId, departmentdesc: departmentdesc, });
});



router.post("/createPpmp", async function (req, res) {

var departmentdesc =null;
  var ppmpHdrId = req.body.hiddenppmphdrIdnew
  var ppmphdr =  await PpmpHdr.findById(ppmpHdrId);
var ppmpDtlstage = ppmphdr.ppmpType;
var departmentId =  ppmphdr.departmentId;

  var selectedcategory = null;
   var unitOfMeasurements = await UnitOfMeasurement.find({});
  var procModes = await ProcMode.find({});
  const user = await User.findById(req.user._id);

var department = await Department.findById(departmentId)
  department == null ? departmentdesc = null : departmentdesc = department.description




  var newPpmpDtl = new PpmpDtl({
    ppmpHdrId:ppmpHdrId,
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
    remarks:req.body.remarks,

     procStage: ppmpDtlstage ,
    appEndUser : departmentdesc,
    appProcModes : req.body.procMode,
    appCoveredEPA:"No", 
    appCriteriaBidEval: ""
 });

console.log(newPpmpDtl); 

  try {
  // var ppmpnew = await newPpmpDtl.save();
  }
  catch (err) {
    req.flash("error", err);
    console.log(err);
    console.log("error insaving ppmpDtl");
  }
  
  const selectedValue = req.body.hiddenppmphdrIdnew;
const page = parseInt(req.query.page) || 1;
 const limit = 5; // records per page
  const search = req.query.search || '';
var query = null;
  if (search== ''){
query={ ppmpHdrId: selectedValue }
  }
  else{

  //const query = {procLawCategoryId: "Goods" };
console.log("search"+ search);
  query = {
      ppmpHdrId: selectedValue ,
    $or: [
      
      { sourceOfFund: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { position: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } }
    ]
  }; }
console.log(query);
  const totalPpmpDtl = await PpmpDtl.countDocuments(query);
  const ppmpDtl = await PpmpDtl.find(query)
    .skip((page - 1) * limit)
    .limit(limit);

 
    //if (selectedValue != "null") { ppmpDtl = await PpmpDtl.find({ ppmpHdrId: selectedValue }).sort({ createdAt: -1 });
   selectedcategory =  ppmpDtl.procLawCategoryId
  
    // 'mySelect' is the name attribute of your <select>
  
  var personId = user.personId;
  var person = await Person.findById(personId);
  var departmentId = null;
  var departmentdesc = null;
  if (person != null) {
    departmentId = person.departmentId;    
  }
  var department = await Department.findById(departmentId)
  department == null ? departmentdesc = null : departmentdesc = department.description;

 var ppmpHdr = await PpmpHdr.find({ "departmentId": departmentId, fiscalYear: 2026 })
   res.render("ppmp/ppmp", { departmentId: departmentId, 
                          personId: personId, 
                          departmentdesc: departmentdesc, 
                          ppmpHdrs:ppmpHdr, 
                          selectedValue: selectedValue, 
                          ppmpDtls:ppmpDtl,
                           unitOfMeasurements: unitOfMeasurements,
                          procModes: procModes,
                          selectedcategory:selectedcategory,
                          search,
                          currentPage: page,
                        totalPages: Math.ceil(totalPpmpDtl / limit)
                        });  
 //res.redirect("/ppmp");

}) 


router.post("/edit/:ppmpId", async function (req, res) {

  console.log("in side edit")
  var ppmpDtl=null;
  var ppmpDtlId = req.params.ppmpId;
  var selectedcategory = null;
   var unitOfMeasurements = await UnitOfMeasurement.find({});
  var procModes = await ProcMode.find({});
  const user = await User.findById(req.user._id);
  var ppmpDtl = await PpmpDtl.findById(ppmpDtlId); 

  console.log("before",ppmpDtl);
    ppmpDtl.ppmpHdrId = req.body.hiddenppmphdrIdnew,
    ppmpDtl.generalDescName=req.body.generalDescName,
    ppmpDtl.procLawCategoryId =req.body.ppmpCategory,
    ppmpDtl.quantity =req.body.quantity,
    ppmpDtl.unitMeasurement  =req.body.unitOfMeasurement,
    ppmpDtl.procurementMode =req.body.procMode,
 
    ppmpDtl.startProc= req.body.startProc,
    ppmpDtl.endProc = req.body.endProc,
    ppmpDtl.expectedDelivery = req.body.expectedDelivery,
    ppmpDtl.sourceOfFund  = req.body.sourceOfFound, 
    ppmpDtl.estimatedBudget = req.body.estimatedBudget,
    ppmpDtl.attachedSupportingDocs = req.body.attachedSupportingDocs,
    ppmpDtl.remarks=req.body.remarks

   console.log("before",ppmpDtl);


  try {
   await ppmpDtl.save();
  }
  catch (err) {
    req.flash("error", err);
    console.log(err);
    console.log("error insaving ppmpDtl");
  }
  const selectedValue = req.body.hiddenppmphdrIdnew;
  console.log(selectedValue);  
    selectedValue != "null"?  ppmpDtl = await PpmpDtl.find({ ppmpHdrId: selectedValue }).sort({ createdAt: -1 }):"";
   selectedcategory =  PpmpDtl.procLawCategoryId

    // 'mySelect' is the name attribute of your <select>
  
  var personId = user.personId;
  var person = await Person.findById(personId);
  var departmentId = null;
  var departmentdesc = null;
  if (person != null) {
    departmentId = person.departmentId;    
  }
  var department = await Department.findById(departmentId)
  department == null ? departmentdesc = null : departmentdesc = department.description;

 var ppmpHdr = await PpmpHdr.find({ "departmentId": departmentId, fiscalYear: 2026 })
   res.render("ppmp/ppmp", { departmentId: departmentId, 
                          personId: personId, 
                          departmentdesc: departmentdesc, 
                          ppmpHdrs:ppmpHdr, 
                          selectedValue: selectedValue, 
                          ppmpDtls:ppmpDtl,
                           unitOfMeasurements: unitOfMeasurements,
                          procModes: procModes,
                          selectedcategory:selectedcategory
                        });  
 //res.redirect("/ppmp");

}) 






router.post("/saveppmpHdr", async function (req, res) {





  const user = await User.findById(req.user._id);

   var fiscalYear= req.body.fiscalYear;
   var ppmpType= req.body.ppmptype;
   var  departmentId=  req.body.hiddepartmentId;

 const existingRecord = await PpmpHdr.findOne({
      departmentId,
      fiscalYear,
      ppmpType
    });

    console.log(existingRecord,  departmentId, fiscalYear, ppmpType);
   if (existingRecord) {

    console.log("duplicate");

     
    }

else{

  var newPpmpHdr = new PpmpHdr({
    versionNo: req.body.versionNo == undefined ? null : req.body.versionNo,
    fiscalYear: req.body.fiscalYear == undefined ? null : req.body.fiscalYear,
    ppmpType: req.body.ppmptype == undefined ? null : req.body.ppmptype,
    departmentId: req.body.hiddepartmentId,
    prepareBy: req.body.hidpersonId,
    submitBy: req.body.hidpersonId,
    status: null,
    dateprepared: Date.now(),
    dateSubmitted: null
  });
  try {
    var ppmpnew = await newPpmpHdr.save();
  }
  catch (err) {
    req.flash("error", err);
  }

}
  res.redirect("/ppmp");
})
 


 
router.post("/delete/:ppmpDtlId", async function(req, res){

 await PpmpDtl.findByIdAndDelete(req.params.ppmpDtlId);
res.redirect("/ppmp/"+ req.body.hiddenppmphdrIddelete);
  }) 






















module.exports = router;