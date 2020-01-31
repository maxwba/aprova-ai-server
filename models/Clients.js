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
});
const Client = model('Clients', clientSchema);
module.exports = Client;
