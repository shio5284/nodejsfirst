var mongoose = require("mongoose");


var ppmpPurhaseRequestSchema = mongoose.Schema({
    ppmpPrHdrId:{type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    ppmpItemId:{type: String, required : false}, 
    departmentId:{type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    fiscalYear:{type:Number ,required : false },
    generalDescName: {type: String, required : true},    
    quantity :{type:Number ,required : false },
    price :{type:Number ,required : false },  
    unit : {type: String, required : false}, 
    status : {type: String, required : false}, 
    isInclude: {type:Boolean, default:false},
    remarks: {type: String, required : false},
    approvedBy : {type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    preparedBy :{type:mongoose.Schema.Types.ObjectId, required: false, unique: false},

});

var PpmpPurhaseRequest = mongoose.model("PpmpPurhaseRequest",ppmpPurhaseRequestSchema);
module.exports =PpmpPurhaseRequest;