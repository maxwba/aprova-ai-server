require('dotenv').config();
const express = require('express');

const router = express.Router();
const Client = require('../models/Clients');

router.post('/', (req, res) => {
  if (req.isAuthenticated()) {
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
  }
  res.status(400).json({ message: 'Sem permissao' });
});

module.exports = router;
