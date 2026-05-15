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
  
var status = null;
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
      departmentId: depid,
      $or: [
        { generalDescription: { $regex: search, $options: 'i' } },
        { unitOfMeasurement: { $regex: search, $options: 'i' } }

      ]
    };
  }
  else {
    query = {
      departmentId: depid,
      fiscalYear: 2027
    };
  }

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


  //determine if PR is already submitted

  const isAlreadySubmitted = await PpmpPrStatus.findOne({
    departmentId: depid,
    fiscalYear: 2027,
    submittedPR: true

  });

   //determine if ready to accept

  const isReadyToAccept = await PpmpPrStatus.findOne({
    departmentId: depid,
    fiscalYear: 2027,
    purchased: true

  });


  //determine if PR is already acceptted

  const isAlreadyAccepted = await PpmpPrStatus.findOne({
    departmentId: depid,
    fiscalYear: 2027,
   accepted: true

  });




  console.log("issubmit" + isAlreadySubmitted);

  res.render("ppmpPr/ppmpPr", {
    isAlreadyAccepted:isAlreadyAccepted,
    isReadyToAccept:isReadyToAccept,
    isAlreadySubmitted: isAlreadySubmitted,
    status:status,
    departmentId: depid,
    personId: PersonId,
    departmentdesc: departmentdesc,
    ppmpPurchaseRequests: ppmpPurchaseRequest,
    unitOfMeasurements: unitOfMeasurements,
    procModes: procModes,
    search,
    currentPage: page,
    totalPages: Math.ceil(totalPpmpItem / limit)
  });
});

router.post("/createPR", async function (req, res) {
  console.log("itemcodePR" + req.body.itemCodePR);
  try {
    const existing = await PpmpPurchaseRequest.findOne({
      ppmpItemId: req.body.itemCodePR,
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
      ppmpItemId: req.body.itemCodePR,
      ppmpPrHdrId: null,
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

})



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




router.post("/submitPR", async function (req, res) {

  var submitby = "";
  var person = await Person.findById(req.body.hidpersonId)
  if (person) {
    submitby = person.fName + " " + person.lName;
  }
  try {
    const existing = await PpmpPrStatus.findOne({
      departmentId: req.body.hiddepartmentId,
      fiscalYear: 2027
    });

    if (existing) {
      console.log("duplicate");
      req.flash("info", " duplicate PR header .");
      return res.redirect("/ppmpPr");
    }
    const rawDate = '2027-01-14';// string input
    const date = new Date(Date.now());

    const formattedDate =
      (date.getMonth() + 1) + '/' +
      date.getDate() + '/' +
      date.getFullYear();



    var newPpmpPrStatus = new PpmpPrStatus({
      fiscalYear: 2027,
      departmentId: req.body.hiddepartmentId,
      submittedPR: true,
      submittedPrBy: submitby,
      submittedPrDate: formattedDate,

      bidding: false,
      biddingBy: "",
      biddingDate: null,

      purchased: false,
      purhasedBy: "",
      biddingDate: null,

      accepted: false,
      acceptedBy: "",
      acceptedDate: null,
      remarks: ""

    });

    console.log(newPpmpPrStatus);
    await newPpmpPrStatus.save();


    await PpmpPurchaseRequest.updateMany(
      {
        departmentId: req.body.hiddepartmentId,
        fiscalYear: 2027
      },
      {
        $set: {
          ppmpPrHdrId: newPpmpPrStatus._id,
          status: "Submitted"
        }
      }
    );


    req.flash("info", "Purchase Sucessfully Saved.");

  }
  catch (err) {

    console.log(err);
    req.flash("error", err);
  }

  res.redirect("/ppmpPr");

})

router.post("/acceptItem", async function (req, res) {

console.log(req.body.hidpersonIdAcceptItem);
 const isReadyToAccept = await PpmpPrStatus.findOne({
    departmentId: req.body.hiddepartmentIdAcceptItem,
    fiscalYear: 2027,
    purchased: true

  });


  if (isReadyToAccept==null)

  {  
     console.log("inside trap"+isReadyToAccept);
    req.flash("info", " Items not yet Purchased .");
      return res.redirect("/ppmpPr");
  }
var stathdrid= isReadyToAccept._id;
  
  var acceptedBy = "";
  var person = await Person.findById(req.body.hidpersonIdAcceptItem)
  if (person) {
    acceptedBy = person.fName + " " + person.lName;
  }
  try {
    const existing = await PpmpPrStatus.findOne({
      departmentId: req.body.hiddepartmentId,
      fiscalYear: 2027
    });

    if (existing) {
      console.log("duplicate");
      req.flash("info", " duplicate PR header .");
      return res.redirect("/ppmpPr");
    }
    const rawDate = '2027-01-14';// string input
    const date = new Date(Date.now());

    const formattedDate =
      (date.getMonth() + 1) + '/' +
      date.getDate() + '/' +
      date.getFullYear();



   var PpmpPrStatusSel = await PpmpPrStatus.findById(stathdrid)

  
      PpmpPrStatusSel.accepted = true,
      PpmpPrStatusSel.acceptedBy = acceptedBy,
      PpmpPrStatusSel.acceptedDate = formattedDate,

 

   
   await PpmpPrStatusSel.save();



    await PpmpPurchaseRequest.updateMany(
      {
        ppmpPrHdrId: PpmpPrStatusSel._id,
        fiscalYear: 2027
      },
      {
        $set: {
         
          status: "Accepted"
        }
      }
    );


    req.flash("info", "Sucessfully Accepted  Item.");

  }
  catch (err) {

    console.log(err);
    req.flash("error", err);
  }

  res.redirect("/ppmpPr");

})


module.exports = router;