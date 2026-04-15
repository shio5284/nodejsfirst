const mongoose = require("mongoose");
const Counter = require("./counter");

const itemSchema = new mongoose.Schema({
  itemCode: {
    type: String,
    unique: true
  },
  generalDescription: String,
 
  unitOfMeasurement: String,
  unitPrice:Number,
  modeProcurement:String,
   remarks:String
 
});


// AUTO INCREMENT BEFORE SAVE
itemSchema.pre("save", async function (next) {

  if (!this.isNew) return next();

  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "itemCode" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // FORMAT → 001, 002, 003
    this.itemCode = String(counter.seq).padStart(3, "0");

    next();

  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Item", itemSchema);