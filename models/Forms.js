const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const formSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Clients' // <=== Esse nome é o mesmo nome do model de Clients
    },
    title: {
      type: String,
      required: true,
    },
    formDescription: {
      enum: ['Descrição', 'data', 'History', null],
      description: 'can only be one of the enum values and is required',
    },
  },
  {
    timestamps: true,
  },
);
const Form = model('Form', formSchema);
module.exports = Form;
