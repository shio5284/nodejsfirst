var mongoose = require("mongoose");

var unitOfMeasurementSchema = mongoose.Schema({
    unitOfMeasurementDesc: {type: String, required : true}  });



var UnitOfMeasurement = mongoose.model("UnitOfMeasurement",unitOfMeasurementSchema);
module.exports =UnitOfMeasurement;