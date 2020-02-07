require("dotenv").config();
const Form = require("../models/Forms");
const Task = require("../models/Task");

const express = require("express");
const router = express.Router();

router.get("/forms", (req, res) => {
  Form.find()
    .populate("Clients")
    .then(allForm => {
      res.json(allForm);
    })
    .catch(err => {
      res.json(err);
    });
});

router.get("/tasks", (req, res) => {
  Task.find()
    .populate("Clients")
    .then(allTask => {
      res.json(allTask);
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;
