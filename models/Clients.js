const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const clientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  shareLink: String,
  form: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Form',
    },
  ],
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // <=== Esse nome é o mesmo nome do model de company
  },
});
const Client = model('Clients', clientSchema);
module.exports = Client;
