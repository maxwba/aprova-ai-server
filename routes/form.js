require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

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


// DELETE route => to delete a specific project
router.delete('/:formId', (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
    res.status(400).json({
      message: 'Specified id is not valid',
    });
    return;
  }
  Form.findByIdAndRemove(req.params.formId)
    .then(() => {
      res.json({
        message: `Form with ${req.params.formId} is removed successfully.`,
      });
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
