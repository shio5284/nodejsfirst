var mongoose = require("mongoose");

var ppmpTypeSchema = mongoose.Schema({
    ppmpTypedesc: {type: String, required : true},
    isInclude: {type:Boolean, default:false, required: false, unique:false}
   });



var PpmpType = mongoose.model("PpmpType",ppmpTypeSchema);
module.exports =PpmpType;
