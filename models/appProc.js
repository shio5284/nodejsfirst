var mongoose = require("mongoose");

var appProcSchema = mongoose.Schema({
    fiscalYear: {type: String, required : true},
    appTypeId :{type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    appCategoryId :{type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    projectTitle: {type: String, required : false},
    implementingUnit: {type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    modeOfProcurementId: {type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    isEarlyProcurement: {type:Boolean, default:false, required: false, unique:false},
    criteriaForBidEval_Id: {type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    procActStart: {type: Date, required : false},
    procActEnd: {type: Date, required : false},
    sourceOfFund:{type:Number ,required : false },
    estimatedBudget:{type:Number,required : false },
    createdAt: {type: Date, default : Date.now},
    preparedBy:  {type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    recommendedBy:{type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    approvedBy :{type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
  
   Remarks: {type: String, required : false}

});

var AppProc = mongoose.model("AppProc",appProcSchema);
module.exports =AppProc;