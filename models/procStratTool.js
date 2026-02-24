var mongoose = require("mongoose");

var procStratToolSchema = mongoose.Schema({
    procStratToolDesc: {type: String, required : true}   
   });

``

var ProcStratTool = mongoose.model("ProcStratTool",procStratToolSchema);
module.exports =ProcStratTool;