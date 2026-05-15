var mongoose = require("mongoose");

var purchaseRequestHdrSchema = mongoose.Schema({
    versionNo:{type:Number ,required : false },
    fiscalYear:{type:Number ,required : true },
    ppmpType : {type: String, },
    departmentId :{type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    prepareBy : {type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    submitBy: {type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    status:{type:Boolean, default:false, required: false, unique:false},
    dateprepared: {type: Date, required : false},
    dateSubmitted: {type: Date, required : false},

});

var PurchaseRequestHdr = mongoose.model("PurchaseRequestHdr",purchaseRequestHdrSchema);
module.exports =PurchaseRequestHdr;