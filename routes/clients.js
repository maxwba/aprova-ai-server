require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const router = express.Router();
const Client = require('../models/Clients');

router.post('/', (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(400).json({ message: 'Sem permissao' });
  }
  const { name } = req.body;
  const { email } = req.body;
  const { _id } = req.user;

  const password = name
    .split("")
    .reduce((acc, elemento) => acc + elemento.charCodeAt(), "");

  if (name === "") {
    res.status(400).json({ message: "Preecha o nome" });
  }

  // Isso e o que manda o body para API
  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt);
  const newClient = new Client({
    name,
    email,
    companyId: _id,
    password: hashPass
  });

  const { name: clientName, _id: id } = newClient;
  newClient.shareLink = `${
    process.env.SHARE
  }/clientdashboard/${clientName.toLowerCase()}/${id}`;
  newClient.save(error => {
    if (error) {
      res
        .status(400)
        .json({ message: 'Saving Client to database went wrong.' });
      return;
    }
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "aprova.ai.ironhack@gmail.com",
        pass: "ironhack6"
      }
    });
    transporter
      .sendMail({
        from: "Aprova ai <aprova.ai.ironhack@gmail.com>",
        to: email,
        subject: "Bem vindo ao Aprova ai!",
        text: `Bem vindo ao Aprova ai! Você foi convidado a acessar a plataforma e solicitar Jobs de forma personalizada para seu cliente ${password} Clique aqui para acessar seu link  ${newClient.shareLink}.`,
        html: `<h3>Bem vindo ao Aprova ai! Você foi convidado a acessar a plataforma e solicitar Jobs de forma personalizada para seu cliente. ${password}, <link>${newClient.shareLink}</link></h3>`
      })
      .then(() => {
        res.status(200).json(newClient);
      })
      .catch(err => {
        res.json(err);
      });
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
