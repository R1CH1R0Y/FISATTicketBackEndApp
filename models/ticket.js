const mongoose = require("mongoose");

let ticketSchema = mongoose.Schema({
  "date": { type: String, required: true },
  "route": { type: String, required: true },
  "userId": { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }
});

let ticketmodel = mongoose.model("Tickets", ticketSchema);

module.exports = { ticketmodel };