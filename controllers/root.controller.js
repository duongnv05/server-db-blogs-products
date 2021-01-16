const express = require('express');

const router = express.Router();

function RootController() {
    this.router = router;
}

RootController.prototype = {}

module.exports = RootController;