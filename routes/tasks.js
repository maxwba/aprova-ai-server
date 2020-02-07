require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Task = require('../models/Task');


// Task create
router.post('/', (req, res, next) => {
  // if (!req.isAuthenticated()) {
  //   res.status(400).json({
  //     message: 'Sem permissao',
  //   });
  // }
  const { clientId, aproval, properties } = req.body;

  const newTask = new Task({
    clientId,
    aproval,
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

// Task update
router.post('/:taskId', (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.taskId)) {
    res.status(400).json({
      message: 'Specified id is not valid',
    });
    return;
  }
  Task.findByIdAndUpdate(req.params.taskId, { aproval: req.body.aproval })
    .then(() => {
      res.json({
        message: `Task with ${req.params.taskId} is updated successfully.`,
      });
    })
    .catch((err) => {
      res.json(err);
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
