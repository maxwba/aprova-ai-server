require('dotenv').config();
const express = require('express');

const router = express.Router();
const Client = require('../models/Clients');

router.post('/', (req, res) => {
  console.log(req.user)
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
  Client.find()
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
    .then((client) => {
      res.json(client);
    })
    .catch((err) => {
      res.json(err);
    });
});


module.exports = router;
