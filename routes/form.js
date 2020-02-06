require('dotenv').config();
const express = require('express');

const router = express.Router();
const Form = require('../models/Forms');

router.post('/', (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(400).json({
      message: 'Sem permissao',
    });
  }
  const {
    clientId,
    title,
    description,
    type,
    properties,
  } = req.body;

  const newForm = new Form({
    clientId,
    title,
    description,
    type,
    properties,
  });

  newForm
    .save()
    .then((form) => {
      res.status(200).json(form);
    })
    .catch((error) => {
      next(error);
    });
});

// Get form clients
router.get('/', (req, res) => {
  Form.find()
    .populate('Clients')
    .then((allTheClients) => {
      res.json(allTheClients);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
