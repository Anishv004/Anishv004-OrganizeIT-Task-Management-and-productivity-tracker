const express = require('express');
const tagsController = require('../Controller/tagsController');

const route = express.Router();

route.route('/')
    .get(tagsController.getAllTags)
    .post(tagsController.addNewTag)

route.route('/:id')
   .delete(tagsController.deleteTag)

module.exports = route;