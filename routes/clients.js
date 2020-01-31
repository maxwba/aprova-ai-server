require('dotenv').config();
const express = require('express');

const router = express.Router();
const Client = require('../models/Clients');


router.post('/', (req, res) => {
  const { name } = req.body;

  if (name === '') {
    res.status(400).json({ message: 'Preecha o nome' });
  }

  const newClient = new Client({
    name,
  });

  const { name: clientName, _id: id } = newClient;
  newClient.shareLink = `${process.env.SHARE}/${clientName.toLowerCase()}/${id}`;
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

module.exports = router;
