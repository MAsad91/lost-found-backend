const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const foundItemsReportsSchema = new Schema({
  name: { type: String, required: true },
  itemname: { type: String, required: true },
  state: { type: String, required: true },
  founditemtype: { type: String, required: true },
  color: { type: String, required: true },
  location: { type: String, required: true },
  details: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("FoundItemsReport", foundItemsReportsSchema);
