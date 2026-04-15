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


var ppmpHdrId = null;
var selectedValue =req.params.postId;
 
selectedValue != undefined?  selectedValue =req.params.postId: "null";


 const page = parseInt(req.query.page) || 1;
  const limit = 5; // records per page
  const search = req.query.search || '';
var query = null;
  if (search== ''){
query={ppmpHdrId: selectedValue}
  }
  else{

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

  const totalPpmpDtl = await PpmpDtl.countDocuments();
  const ppmpDtl = await PpmpDtl.find()
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

  var ppmpHdr = await PpmpHdr.findOne({ "departmentId": departmentId, fiscalYear: 2026 });
 ppmpHdr!=null? ppmpHdrId = ppmpHdr._id:ppmpHdrId = null; 


  
  res.render("ppmp/ppmp", {
    departmentId: departmentId, 
    personId: personId,
    departmentdesc: departmentdesc,
    ppmpHdrId: ppmpHdrId,
    type:null,
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







router.get("/:postId", async function(req, res){

 var selectedValue = req.params.postId; 

console.log ( selectedValue )
 var toBesplice =  selectedValue.split(",");

 var type = toBesplice[0];
 var hdrid = toBesplice[1];  

hdrid=="null"? selectedValue="692a661c49433110505602b3" :selectedValue =hdrid;

  const page = parseInt(req.query.page) || 1;
  
  const limit = 5; // records per page
  const search = req.query.search || '';
var query = null;
  if (search== ''){
query={ ppmpHdrId: hdrid, ppmpType: type}
  }
  else{

 
  query = {
      ppmpHdrId: hdrid ,
      ppmpType: type,
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

if (type =="None"){type=null;}

  res.render("ppmp/ppmp", {
    departmentId: departmentId,
    personId: personId,
    departmentdesc: departmentdesc,
    type:type,
    ppmpHdrId: hdrid,
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
/* router.post("/", async function (req, res) {
  console.log("YOU R INSIDE THE SELECT CHANGE")
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

}); */





router.post("/createPpmp", async function (req, res) {

var departmentdesc =null;
  var ppmpHdrId = req.body.hiddenppmphdrIdnew
  var ppmphdr =  await PpmpHdr.findById(ppmpHdrId);
var fiscalYear = ppmphdr.fiscalYear;
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
    appCategoryItem:"Genaral Item",
     fiscalYear:fiscalYear,
     ppmpType:req.body.hiddenppmpdtlType ,
     procStage: "PPMP" ,
    appEndUser : departmentdesc,
    appProcModes : req.body.procMode,
    appCoveredEPA:"No", 
    appCriteriaBidEval: "",
     appProcStrac:"",
     appRemarks: ""
 });





  try {
  var ppmpnew = await newPpmpDtl.save();

  }
  catch (err) {
    req.flash("error", err);
 
  }
  
  const selectedValue = req.body.hiddenppmphdrIdnew;
const page = parseInt(req.query.page) || 1;
 const limit = 5; // records per page
  const search = req.query.search || '';
var query = null;
  if (search== ''){
query={ ppmpHdrId: selectedValue,
    ppmpType:req.body.hiddenppmpdtlType,
        
 }
  }
  else{



  query = {
      ppmpHdrId: selectedValue ,
      ppmpType:req.body.hiddenppmpdtlType,
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
                          ppmpHdrId:ppmpHdrId,
                          type:req.body.hiddenppmpdtlType,
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
 // var ppmpDtl=null;
  var ppmpDtlId = req.params.ppmpId;
  var selectedcategory = null;
   var unitOfMeasurements = await UnitOfMeasurement.find({});
  var procModes = await ProcMode.find({});
  const user = await User.findById(req.user._id);
  var ppmpDtledit = await PpmpDtl.findById(ppmpDtlId); 

  console.log("before",ppmpDtledit);
    ppmpDtledit.ppmpHdrId = req.body.hiddenppmphdrIdnew,
    ppmpDtledit.generalDescName=req.body.generalDescName,
    ppmpDtledit.procLawCategoryId =req.body.ppmpCategory,
    ppmpDtledit.quantity =req.body.quantity,
    ppmpDtledit.unitMeasurement  =req.body.unitOfMeasurement,
    ppmpDtledit.procurementMode =req.body.procMode,
 
    ppmpDtledit.startProc= req.body.startProc,
    ppmpDtledit.endProc = req.body.endProc,
    ppmpDtledit.expectedDelivery = req.body.expectedDelivery,
    ppmpDtledit.sourceOfFund  = req.body.sourceOfFound, 
    ppmpDtledit.estimatedBudget = req.body.estimatedBudget,
    ppmpDtledit.attachedSupportingDocs = req.body.attachedSupportingDocs,
    ppmpDtledit.remarks=req.body.remarks

   console.log("before",ppmpDtledit);


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

const page = parseInt(req.query.page) || 1;
 const limit = 5; // records per page
  const search = req.query.search || '';
var query = null;
  if (search== ''){
query={ ppmpHdrId: selectedValue,
    ppmpType:req.body.hiddenppmpdtlTypeedit,
        
 }
  }
  else{



  query = {
      ppmpHdrId: selectedValue ,
      ppmpType:req.body.hiddenppmpdtlType,
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
                          type:req.body.hiddenppmpdtlTypeedit,
                          ppmpHdrId: selectedValue, 

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






router.post("/saveppmpHdr", async function (req, res) {



  const user = await User.findById(req.user._id);

   var fiscalYear= req.body.fiscalYear;

   var  departmentId=  req.body.hiddepartmentId;

 const existingRecord = await PpmpHdr.findOne({
      departmentId,
      fiscalYear
      
    });



    console.log(existingRecord,  departmentId, fiscalYear);
   if (existingRecord) {

    console.log("duplicate");

     
    }

else{



  var newPpmpHdr = new PpmpHdr({
    versionNo: req.body.versionNo == undefined ? null : req.body.versionNo,
    fiscalYear: req.body.fiscalYear == undefined ? null : req.body.fiscalYear,
    ppmpType: null,
    departmentId: req.body.hiddepartmentId,
    prepareBy: req.body.hidpersonId,
    submitBy: req.body.hidpersonId,
    status: null,
    dateprepared: Date.now(),
    dateSubmitted: null
  });






    console.log(newPpmpHdr);
   var ppmpnew = await newPpmpHdr.save();
console.log("don saving");




}
  res.redirect("/ppmp");
})
 
 

 
router.post("/delete/:ppmpDtlId", async function(req, res){

 await PpmpDtl.findByIdAndDelete(req.params.ppmpDtlId);
res.redirect("/ppmp/"+ req.body.hiddenTypedelete+","+ req.body.hiddenppmphdrIddelete);
  }) 

    
 router.post("/saveToApp", async function(req, res) {
 
   var type = req.body.hiddenppmpdtlTypeSubmitApp
   var ppmpHdrId = req.body.hiddenppmphdrIdSubmitApp
  

console.log("you are here");
console.log(ppmpHdrId);

 const result = await PpmpDtl.updateMany(
      {ppmpHdrId: ppmpHdrId,
    ppmpType:type,
  fiscalYear:"2026"},
     { $set: { procStage: "APP" } } 

      )


      console.log(result);
  /* try {
      const result = await PpmpDtl.updateMany(
      {ppmpHdrId: selectedValue,
    ppmpType:"final"},
      { $set: { [procStage]: APP } } 
    );


    res.json({
      message: `Field '${field}' updated for all records`,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } */
});




















module.exports = router;