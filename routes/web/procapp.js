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



router.get("/", async function (req, res) {

  var filter =  {procLawCategoryId: "Goods" }
//var ppmpDtl = await PpmpDtl.find(filter);
 const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const total = await PpmpDtl.countDocuments(filter);
  const ppmpDtl = await PpmpDtl.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });



  var unitOfMeasurements = await UnitOfMeasurement.find({});
  var procModes = await ProcMode.find({});
  const selectedValue = "null";
  var selectedcategory = "null";

   
                                  selectedcategory =  ppmpDtl.procLawCategoryId
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

  res.render("procapp/procapp", {
    departmentId: departmentId,
    personId: personId,
    departmentdesc: departmentdesc,
    ppmpHdrs: ppmpHdr,
    selectedValue: selectedValue,
    ppmpDtls: ppmpDtl,
    unitOfMeasurements: unitOfMeasurements,
    procModes: procModes,
    selectedcategory:selectedcategory,
    currentPage: page,
    totalPages: Math.ceil(total / limit)
  });
});







module.exports = router;