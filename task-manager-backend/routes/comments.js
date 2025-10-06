// routes/comments.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const { getCommentsForTask, createComment } = require('../controllers/CommentController');

router.route('/').get(getCommentsForTask).post(createComment);
    
module.exports = router;