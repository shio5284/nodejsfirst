var mongoose = require("mongoose");

var ppmpDtlSchema = mongoose.Schema({
    ppmpHdrId:{type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    generalDescName: {type: String, required : true},
    procLawCategoryId :{type: String, required : true},
    quantity :{type:Number ,required : false },
    unitMeasurement  : {type: String, required : false}, 
    procurementMode : {type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    preProcCon:{type:Boolean, default:false, required: false, unique:false},
    status:{type:Boolean, default:false, required: false, unique:false},
    startProc: {type: Date, required : false},
    endProc: {type: Date, required : false},
    expectedDelivery:{type: Date, required : false},
    sourceOfFund : {type: String, required : false}, 
    estimatedBudget: {type:Number ,required : false },
    attachedSupportingDocs: {type: String, required : false}, 
    remarks:{type: String, required : false},
    procStage:  {type: String, required : false},
    appEndUser : {type: String, required : false},
    appProcModes : {type: String, required : false},
    appCoveredEPA:{type: String, required : false}, 
    appCriteriaBidEval: {type: String, required : true}

});

var PpmpDtl = mongoose.model("PpmpDtl",ppmpDtlSchema);
module.exports =PpmpDtl;