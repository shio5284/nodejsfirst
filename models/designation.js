var mongoose = require("mongoose");

var designationSchema = mongoose.Schema({
    designationDesc: {type: String, required : true},
    isInclude: {type:Boolean, default:true, required: false, unique:false},
    code: {Number}
   });



var Designation = mongoose.model("Designation",designationSchema);
module.exports =Designation;