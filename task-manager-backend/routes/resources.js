// routes/resources.js
const express = require('express');
const { deleteResource } = require('../controllers/resourceController');
const router = express.Router();

router.route('/:resourceId').delete(deleteResource);
module.exports = router;