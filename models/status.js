var mongoose = require("mongoose");

var statusSchema = mongoose.Schema({
   
    fiscalYear:{type:Number ,required : true },    
    departmentId :{type:mongoose.Schema.Types.ObjectId, required: false, unique: false},  

    submittedPR:{type:Boolean, default:false, required: false},
    submittedPrBy:   {type: String, required : false},
    submittedPrDate: {type: String, required : false},

    bidding:{type:Boolean, default:false, required: false},
    biddingBy:   {type: String, required : false},
    biddingDate: {type: String, required : false},

    purchased:{type:Boolean, default:false, required: false},
    purchasedBy:   {type: String, required : false},
    purhasedDate: {type: String, required : false},

    accepted:{type:Boolean, default:false, required: false},
    acceptedBy:   {type: String, required : false},
    acceptedDate: {type: String, required : false},
    remarks:{type:String, required: false},
   
});

var Status = mongoose.model("Status",statusSchema);
module.exports =Status;