const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const formSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Clients" // <=== Esse nome é o mesmo nome do model de Clients
    },
    title: String,
    description: String,
    type: String,
    properties: Object
  },
  {
    timestamps: true
  }
);
const Form = model("Form", formSchema);
module.exports = Form;
