const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 7 },
  address: { type: String, required: true },
  contactno: { type: Number, required: true },
  crimereports: [
    { type: mongoose.Types.ObjectId, required: true, ref: "CrimeReport" },
  ],
  safelifereports: [
    { type: mongoose.Types.ObjectId, required: true, ref: "SafeLifeReport" },
  ],
  lostitemsreports: [
    { type: mongoose.Types.ObjectId, required: true, ref: "LostItemsReport" },
  ],
  founditemsreports: [
    { type: mongoose.Types.ObjectId, required: true, ref: "FoundItemsReport" },
  ],
  communityservicesrequests: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "CommunityServicesRequest",
    },
  ],
  certificatespermitsrequests: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "CertificatesPermitsRequest",
    },
  ],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
