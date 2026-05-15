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
var PpmpPurchaseRequest = require("../../models/purchaseRequestDtl");
var PpmpPrStatus = require("../../models/status");

router.use(ensureAuthenticated) 

router.get('/search', async (req, res) => {

  try {
    const search = req.query.q || '';

    const query = search
      ? {
        $or: [
          { generalDescription: { $regex: search, $options: 'i' } },
          { itemCode: { $regex: search, $options: 'i' } },
          { unitOfMeasurement: { $regex: search, $options: 'i' } }
        ]
      }
      : {};

    const items = await PpmpItem.find(query).limit(10);

 

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/", async function (req, res) {

var departmentidsel = req.query.departmentprocapp;



var status = null;
var statusPrHdr = null;

  var  departments =  await Department.find({});
  var depid = null;
  var departmentdesc = null;
  const userSel = await User.findById(req.user._id);
  if (userSel != null) {
    var PersonId = userSel.personId;
    if (PersonId != null) {
      const person = await Person.findById(PersonId);
      if (person != null) {
         depid = person.departmentId
        if (depid) {
          var department = await Department.findById(depid)
          department == null ? departmentdesc = null : departmentdesc = department.description
        }
      }
    }
  }

  
  const page = parseInt(req.query.page) || 1;
  const limit = 10; // records per page
  const search = req.query.search || '';
  let query = {}; // always an object

  if (search !== '') {
    query = { 
       departmentId: departmentidsel,
      $or: [
        { generalDescription: { $regex: search, $options: 'i' } },
        { unitOfMeasurement: { $regex: search, $options: 'i' } }

      ]
    };
  }

  else  { query = { 
       departmentId: departmentidsel,
      fiscalYear:2027
      
    };}

  const totalPpmpItem = await PpmpPurchaseRequest.countDocuments(query);
  const ppmpPurchaseRequest = await PpmpPurchaseRequest.find(query)
    .skip((page - 1) * limit)
    .limit(limit);
  var unitOfMeasurements = await UnitOfMeasurement.find({});
  var procModes = await ProcMode.find({});
  const user = await User.findById(req.user._id);


 if (ppmpPurchaseRequest.length > 0) {
  const prOneOnly = ppmpPurchaseRequest[0];
  const ppmpPRHdrId = prOneOnly.ppmpPrHdrId;
  status = await PpmpPrStatus.findById(ppmpPRHdrId);
}


if (status!=null){
  statusPrHdr = status._id
  
} 

 //determine if PR is already Bid

  const isAlreadyBidding = await PpmpPrStatus.findOne({
    departmentId: departmentidsel,
    fiscalYear: 2027,
    bidding: true

  });


  //determine if PR is already Accepted 

    const isAlreadyAccepted = await PpmpPrStatus.findOne({
    departmentId: departmentidsel,
    fiscalYear: 2027,
    purchased: true

  });

  
  res.render("procApp/procApp", {
    isAlreadyAccepted:isAlreadyAccepted,
    isAlreadyBidding:isAlreadyBidding,
  statusPrHdr: statusPrHdr,
    status :status,
    departments: departments,
    departmentId: departmentidsel,
    personId:PersonId,
    departmentdesc: departmentdesc,
    ppmpPurchaseRequests: ppmpPurchaseRequest,
    unitOfMeasurements: unitOfMeasurements,
    procModes: procModes,
    search,
    currentPage: page,
    totalPages: Math.ceil(totalPpmpItem / limit)
  });
});

/* router.post("/createPR", async function (req, res) {

try {
  const existing = await PpmpPurchaseRequest.findOne({
    ppmpItemId: req.body.itemCode,
    departmentId: req.body.hiddepartmentId,
    fiscalYear: 2027,
    status: "PR"
  });

  if (existing) {
  
console.log("duplictae");
    req.flash("info", " duplicate PR!Pls Use Edit the Quantity .");
    return res.redirect("/ppmpPr");
  }

  var newPpmpPurchaseRequest = new PpmpPurchaseRequest({
    ppmpItemId: req.body.itemCode,
    departmentId: req.body.hiddepartmentId,
    fiscalYear: 2027,
    generalDescName: req.body.generalDescName,
    quantity: req.body.quantity,
    price: req.body.pricePerUnit,
    unit: req.body.unitofMeasurement,
    status: "PR",
    isInclude: true,
    remarks: "",
    approvedBy: null,
    preparedBy: req.body.hidpersonId
  });
console.log(newPpmpPurchaseRequest);
 await newPpmpPurchaseRequest.save();
  req.flash("info", "Purchase Sucessfully Saved.");

} catch (err) {
  req.flash("error", err);
}

  res.redirect("/ppmpPr");

}) */



router.post("/edit/:ppmpPRId", async function (req, res) {

  console.log(req.params.ppmpPRId);
 



  var ppmpPRedit = await PpmpPurchaseRequest.findById(req.params.ppmpPRId);

  console.log("before", ppmpPRedit);



    ppmpPRedit.quantity = req.body.quantity,
   

  console.log("after", ppmpPRedit);


  try {
    await ppmpPRedit.save();
    req.flash("info", "Successfully Updated!!");
  }
  catch (err) {
    req.flash("error", err);
    console.log(err);

  }


 res.redirect("/ppmpPr");


})

router.post("/delete/:ppmpDtlId", async function (req, res) {

  console.log(req.params.ppmpDtlId, "delete PR here ");
 await PpmpPurchaseRequest.findByIdAndDelete(req.params.ppmpDtlId);
  res.redirect("/ppmpPR");
})





router.post("/bidItem", async function (req, res) {


var prStatuHdrId = req.body.hidPrHdrBid ;

if (prStatuHdrId== ""){

    req.flash("info", "No Item to Bid Choose Another Department");
    return res.redirect("/procApp");

}

else {
    var bidstatus = await PpmpPrStatus.findById(prStatuHdrId) 

    if (bidstatus.bidding==true){
      req.flash("info", "This PR is already on bidding");
    return res.redirect("/procApp");
    }

}


  var biddingBy = "";
  var person = await Person.findById(req.body.hidpersonId)
  if (person) {
    biddingBy = person.fName + " " + person.lName;
  }
  try {
    
    
    const date = new Date(Date.now());

    const formattedDate =
      (date.getMonth() + 1) + '/' +
      date.getDate() + '/' +
      date.getFullYear();

    var PpmpPrStatusSel = await PpmpPrStatus.findById(prStatuHdrId)


      PpmpPrStatusSel.bidding = true,
      PpmpPrStatusSel.biddingBy = biddingBy,
      PpmpPrStatusSel.biddingDate = formattedDate,

      

  

 
    await PpmpPrStatusSel.save();


    await PpmpPurchaseRequest.updateMany(
      {
        ppmpPrHdrId: prStatuHdrId,
        
      },
      {
        $set: {
          
          status: "Bidding"
        }
      }
    );


    req.flash("info", "Purchase Sucessfully Saved.");

  }
  catch (err) {

    console.log(err);
    req.flash("error", err);
  }

  res.redirect("/procApp");

})


router.post("/purchaseItem", async function (req, res) {


var prStatuHdrId = req.body.hidPrHdrBid ;

if (prStatuHdrId== ""){

    req.flash("info", "No Item to purchase Choose Another Department");
    return res.redirect("/procApp");

}

else {
    var bidstatus = await PpmpPrStatus.findById(prStatuHdrId) 

    if (bidstatus.purchase==true){
      req.flash("info", "This PR is already purchase");
    return res.redirect("/procApp");
    }

}


  var purchasedBy = "";
  var person = await Person.findById(req.body.hidpersonIdAcceptItem)
  if (person) {
    purchasedBy = person.fName + " " + person.lName;
  }
  try {
    
    
    const date = new Date(Date.now());

    const formattedDate =
      (date.getMonth() + 1) + '/' +
      date.getDate() + '/' +
      date.getFullYear();

    var PpmpPrStatusSel = await PpmpPrStatus.findById(prStatuHdrId)

 
      PpmpPrStatusSel.purchased = true,
      PpmpPrStatusSel.purchasedBy = purchasedBy,
      PpmpPrStatusSel.purhasedDate = formattedDate,

   

  

 
   await PpmpPrStatusSel.save();


    await PpmpPurchaseRequest.updateMany(
      {
        ppmpPrHdrId: prStatuHdrId,
        
      },
      {
        $set: {
          
          status: "Purchased"
        }
      }
    );


    req.flash("info", "Purchase Sucessfully Saved.");

  }
  catch (err) {

    console.log(err);
    req.flash("error", err);
  }

  res.redirect("/procApp");

})


module.exports = router;