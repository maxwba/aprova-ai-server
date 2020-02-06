const express = require("express");
const router = express.Router();
const Client = require("../models/Clients");
const bcrypt = require("bcrypt");

router.post("/:clientId", (req, res) => {
  const { clientId } = req.params;
  const { password } = req.body;
  Client.findById(clientId, (err, foundClient) => {
    if (err) {
      res.json(err);
      return;
    }
    if (!foundClient) {
      res.json({ message: "Incorrect client." });
      return;
    }
    if (!bcrypt.compareSync(password, foundClient.password)) {
      res.json({ message: "Incorrect password." });
      return;
    }
    res.json(foundClient);
  });
});

module.exports = router;
