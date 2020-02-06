require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Client = require('../models/Clients');

router.post('/', (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(400).json({ message: 'Sem permissao' });
  }
  const { name } = req.body;
  const { _id } = req.user;

  if (name === '') {
    res.status(400).json({ message: 'Preecha o nome' });
  }

  // Isso e o que manda o body para API
  const newClient = new Client({
    name,
    companyId: _id,
  });

  const { name: clientName, _id: id } = newClient;
  newClient.shareLink = `${
    process.env.SHARE
  }/${clientName.toLowerCase()}/${id}`;
  newClient.save((error) => {
    if (error) {
      res
        .status(400)
        .json({ message: 'Saving Client to database went wrong.' });
      return;
    }
    res.status(200).json(newClient);
  });
});

// Get all clients
router.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(500).json({ message: 'Not authenticated' });
    return;
  }

  const { _id } = req.user;

  Client.find({ companyId: _id })
    .then((allTheClients) => {
      res.json(allTheClients);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get('/:clientName/:clientId', (req, res) => {
  const { clientId } = req.params;
  Client.findById(clientId)
    .then(client => {
      res.json(client);
    })
    .catch(err => {
      res.json(err);
    });
});

// DELETE route => to delete a specific project
router.delete('/:clientId', (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.clientId)) {
    res.status(400).json({
      message: 'Specified id is not valid',
    });
    return;
  }
  Client.findByIdAndRemove(req.params.clientId)
    .then(() => {
      res.json({
        message: `Project with ${req.params.clientId} is removed successfully.`
      });
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
