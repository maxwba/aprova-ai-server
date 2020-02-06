require('dotenv').config();
const express = require('express');

const router = express.Router();
const Task = require('../models/Task');


router.post('/', (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(400).json({
      message: 'Sem permissao',
    });
  }
  const { clientId, aproved, properties } = req.body;

  const newTask = new Task({
    clientId,
    aproved,
    properties,
  });

  newTask
    .save()
    .then((task) => {
      res.status(200).json(task);
    })
    .catch((error) => {
      next(error);
    });
});

// Get all tasks
router.get('/', (req, res) => {
  Task.find()
    .populate('Clients')
    .then((allTheTasks) => {
      res.json(allTheTasks);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
