var mongoose = require("mongoose");

var ppmpSchema = mongoose.Schema({
    fiscalYear: {type: String, required : true},
    departmentId :{type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    generalDescriptionObjective: {type: String, required : false},
   procurementCategory: {type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    startProcurementAct: {type: Date, required : false},
    endProcurementAct: {type: Date, required : false},
    expectedDeliveryDate: {type: Date, required : false},
    sourceOfFund:{type:String,required : false },
    createdAt: {type: Date, default : Date.now},
    
    designationId :{type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
  
    status:{type:Boolean, default:false, required: false, unique:false}

});

var Ppmp = mongoose.model("Ppmp",ppmpSchema);
module.exports =Ppmp;