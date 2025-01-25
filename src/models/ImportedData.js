const mongoose = require("mongoose");

const importedDataSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Amount: { type: Number, required: true },
  Date: { type: Date, required: true },
  Verified: { type: String },
});

module.exports = mongoose.model("ImportedData", importedDataSchema);
