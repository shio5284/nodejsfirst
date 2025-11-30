var mongoose = require("mongoose");

var depatmentSchema = mongoose.Schema({
    description: {type: String, required : true},
    isInclude: {type:Boolean, default:false, required: false, unique:false}
   });



var Department = mongoose.model("Department",depatmentSchema);
module.exports =Department;


