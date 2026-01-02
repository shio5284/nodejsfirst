var mongoose = require("mongoose");

var procModeSchema = mongoose.Schema({
    procModeDesc: {type: String, required : true}   
   });

``

var ProcMode = mongoose.model("ProcMode",procModeSchema);
module.exports =ProcMode;