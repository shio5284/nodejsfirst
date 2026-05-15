var express = require("express");
var multer = require("multer");
var crypto = require("crypto");
var path = require("path");
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;
var Department = require("../../models/department");

var Person = require("../../models/person");
var router = express.Router();
var User = require("../../models/user");
var PpmpDtl = require("../../models/ppmpDtl");
var UnitOfMeasurement = require("../../models/unitOfMeasurement");
var ProcMode = require("../../models/procMode");
var PpmpItem = require("../../models/ppmpItem");

router.use(ensureAuthenticated)




router.get("/", async function (req, res) {


 
 const page = parseInt(req.query.page) || 1;
  const limit = 10; // records per page
  const search = req.query.search || '';
let query = {}; // always an object

if (search !== '') {
  query = {
    $or: [
      { generalDescription: { $regex: search, $options: 'i' } },
      { unitOfMeasurement: { $regex: search, $options: 'i' } }
      
    ]
  };
}

  const totalPpmpItem = await PpmpItem.countDocuments(query);
  const ppmpItem = await  PpmpItem.find(query)
    .skip((page - 1) * limit)
    .limit(limit);
  var unitOfMeasurements = await UnitOfMeasurement.find({});
  var procModes = await ProcMode.find({});   
  const user = await User.findById(req.user._id);

  
  res.render("ppmpItem/ppmpItem", {
    
    ppmpItems: ppmpItem,
    unitOfMeasurements: unitOfMeasurements,
    procModes: procModes,
    search,
    currentPage: page,
    totalPages: Math.ceil(totalPpmpItem / limit)
  });
});

router.post("/createPpmpItem", async function (req, res) {

 
  console.log(req.body.procModenameitem,"procmode");


var procModes = await ProcMode.find({});
  var newPpmpItem = new PpmpItem({ 
  generalDescription: req.body.generalDescName,
  unitOfMeasurement: req.body.unitOfMeasurement, 
  unitPrice:req.body.price,
  modeProcurement:req.body.procMode,
  remarks :req.body.remarks
   
 });

console.log(req.body.procModenameitem,"procmode");

  console.log(newPpmpItem);  


  try {
 var ppmpnew = await newPpmpItem.save();
  }
  catch (err) {
    req.flash("error", err);
    console.log(err);
    console.log("error insaving PPMP Iten");
  }

   

res.redirect("/ppmpItem");
  
})



router.post("/edit/:ppmpItemId", async function (req, res) {
 const page = parseInt(req.query.page) || 1;
  const limit = 10; // records per page
  const search = req.query.search || '';
var query = null;
  if (search== ''){
query=''
  }
  else{

  query = 
     [
      
      { sourceOfFund: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { position: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } }
    ]
  }; 

  const totalPpmpItem = await PpmpItem.countDocuments();
  const ppmpItem = await  PpmpItem.find()
    .skip((page - 1) * limit)
    .limit(limit);

  console.log("in side edit")
  

   var ppmItemId = req.params.ppmpItemId;

   var unitOfMeasurements = await UnitOfMeasurement.find({});
  var procModes = await ProcMode.find({});
 // const user = await User.findById(req.user._id);
  var ppmpItemedit = await PpmpItem.findById(ppmItemId); 
 
  console.log("before",req.body.procModename);

    ppmpItemedit.generalDescription=req.body.generalDescName,
    
    ppmpItemedit.unitPrice =req.body.price,
    ppmpItemedit.unitOfMeasurement  =req.body.unitOfMeasurement,
    ppmpItemedit.modeProcurement =req.body.procModename,

       ppmpItemedit.remarks=req.body.remarks

   console.log("after",ppmpItemedit);


 await ppmpItemedit.save();
   req.flash("info","Successfully Updated!!") ;

 


   res.redirect("/ppmpItem");

  
 
}) 

router.post("/delete/:ppmpDtlId", async function(req, res){

  console.log(req.params.ppmpDtlId,"delete ppmp Item here ");

 await PpmpItem.findByIdAndDelete(req.params.ppmpDtlId);
res.redirect("/ppmpItem/");
  }) 










module.exports = router;