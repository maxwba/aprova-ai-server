const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const companySchema = new Schema({
  email: String,
  password: String,
},
{
  timestamps: true,
});
const Company = model('User', companySchema);
module.exports = Company;
