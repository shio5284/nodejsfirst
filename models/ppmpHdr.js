var mongoose = require("mongoose");

var ppmpHdrSchema = mongoose.Schema({
    versionNo:{type:Number ,required : false },
    fiscalYear:{type:Number ,required : true },
    ppmpType : {type: String, required : true},
    departmentId :{type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    prepareBy : {type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    submitBy: {type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    status:{type:Boolean, default:false, required: false, unique:false},
    dateprepared: {type: Date, required : false},
    dateSubmitted: {type: Date, required : false},

});

var PpmpHdr = mongoose.model("PpmpHdr",ppmpHdrSchema);
module.exports =PpmpHdr;