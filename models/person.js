var mongoose = require("mongoose");

var personSchema = mongoose.Schema({
    lName: {type: String, required : true},
    fName: {type: String, required : true},
    mName: {type: String, required : false},
   suffix: {type: String, required : false},
    dateOfBirth: {type: Date, required : false},
    sex:{type:String,required : false },
    CreatedAt: {type: Date, default : Date.now},
    departmentId :{type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
    designationId :{type:mongoose.Schema.Types.ObjectId, required: false, unique: false},
  
    public:{type:Boolean, default:false, required: false, unique:false}

});

var Person = mongoose.model("Person",personSchema);
module.exports =Person;