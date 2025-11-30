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
var storage = multer.diskStorage({
  destination:'./uploads/images/', 

  filename:function(req,file,cb){
    crypto.pseudoRandomBytes(16,function(err,raw){
    cb(null,raw.toString('hex') + Date.now()+ path.extname(file.originalname));
 
  });
}

})

var upload = multer({storage:storage})
router.use(ensureAuthenticated)




router.get("/" ,async function(req, res){

const user = await User.findById(req.user._id);  
var personId = user.personId;
var  departments =  await Department.find({});
var  designations =  await Designation.find({});
var person = await Person.findById(personId); 
var designationId= null;
var designationdecs= null;
var departmentId= null;
var departmentdesc= null;
var bday  =null;
var formattedDate =null;
var sex=null;


if (person!=null){
  designationId= person.designationId;
  departmentId= person.departmentId;
  bday = person.dateOfBirth;
  formattedDate= bday.toISOString().split("T")[0];
  sex = person.sex;
}

var department = await Department.findById(departmentId)
  department==null? departmentdesc=null: departmentdesc=department.description

var designation =  await Designation.findById(designationId); 
  designation==null ? designationdecs = null : designationdecs = designation.designationDesc;


    res.render("personalInfo/personalInfo",{departments:departments,
         designations:designations,seletedDepartmentDecs:departmentdesc, 
         selecteddesignationdecs:designationdecs,person:person,bdayformat:formattedDate, seletedSex:sex});
      }
    
    );







router.post("/saveperson", async function(req, res){
 
  var  user = await User.findById(req.user._id);  
var personId = null;
var  departments =  await Department.find({});
var  designations =  await Designation.find({});
var person = null;
var designationId= null;
var designationdecs= null;
var departmentId= null;
var departmentdesc= null;
var bday  =null;
var formattedDate =null;
var sex=null;
var newPerson = new Person({
         lName: req.body.lastname,
        fName: req.body.firstname,
        mName: req.body.middlename,
        suffix: req.body.suffix,
        dateOfBirth: req.body.bday,
        sex:req.body.gender,           
        departmentId :req.body.department,
         designationId :req.body.designation,
        });
     
  
 try{ 
     person = await newPerson.save();
 personId = person._id;

user.personId= personId;
 user = await  user.save();
  }
 catch(err){
      req.flash("error", err);
  }
if (person!=null){
  designationId= person.designationId;
  departmentId= person.departmentId;
  bday = person.dateOfBirth;
  formattedDate= bday.toISOString().split("T")[0];
  sex = person.sex;
}

var department = await Department.findById(departmentId)
  department==null? departmentdesc=null: departmentdesc=department.description

var designation =  await Designation.findById(designationId); 
  designation==null ? designationdecs = null : designationdecs = designation.designationDesc;
    res.render("personalInfo",{departments:departments,
         designations:designations,seletedDepartmentDecs:departmentdesc, 
         selecteddesignationdecs:designationdecs,person:person,bdayformat:formattedDate, seletedSex:sex});  
})

     

      
router.post("/updateperson", async function(req, res){
 
const user = await User.findById(req.user._id);  
var personId = user.personId;
var person = await Person.findById(personId); 
var  departments =  await Department.find({});
var  designations =  await Designation.find({});

var designationId= null;
var designationdecs= null;
var departmentId= null;
var departmentdesc= null;
var bday  =null;
var formattedDate =null;
var sex=null;

 

         person.lName = req.body.lastname;
         person.fName = req.body.firstname;
         person.mName =req.body.middlename;
         person.suffix = req.body.suffix;
         person.dateOfBirth = req.body.bday;
         person.sex = req.body.gender;           
         person.departmentId = req.body.department;
         person.designationId =req.body.designation;
        person = await  person.save(); 
     
  

if (person!=null){
  designationId= person.designationId;
  departmentId= person.departmentId;
  bday = person.dateOfBirth;
  formattedDate= bday.toISOString().split("T")[0];
  sex = person.sex;
}

var department = await Department.findById(departmentId)
  department==null? departmentdesc=null: departmentdesc=department.description

var designation =  await Designation.findById(designationId); 
  designation==null ? designationdecs = null : designationdecs = designation.designationDesc;
    res.render("personalInfo/personalInfo",{departments:departments,
         designations:designations,seletedDepartmentDecs:departmentdesc, 
         selecteddesignationdecs:designationdecs,person:person,bdayformat:formattedDate, seletedSex:sex});  
})
       



     


 









module.exports = router;