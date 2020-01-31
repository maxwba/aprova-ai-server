require('dotenv').config();
const express = require('express');

const router = express.Router();
const Forms = require('../models/Forms');

router.post('/', (req, res) => {
  if (req.isAuthenticated()) {
    const { clientId, title, formDescription } = req.body;
  }
});
