const express = require('express');
const fs = require('fs');
const path = require('path');

const { loggerNotify } = require('../services/logger')

const router = express.Router();

loggerNotify('#Initial Controllers');
let files = fs.readdirSync('./controllers');
files.forEach(file => {
    let nameController = path.parse(file).name;
    if(nameController !== 'index'
        && nameController !== "root.controller") {
        router.use((require(`./${nameController}`)).router);
    }
});

module.exports = router;