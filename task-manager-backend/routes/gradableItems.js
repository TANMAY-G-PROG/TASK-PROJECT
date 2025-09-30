// routes/gradableItems.js

const express = require('express');
const router = express.Router({ mergeParams: true }); 
const { createGradableItem, updateGradableItem } = require('../controllers/gradableItemController');

router.route('/').post(createGradableItem);
router.route('/:itemId').put(updateGradableItem);

module.exports = router;