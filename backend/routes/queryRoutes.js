const express = require('express');
const { createQuery, getHistory, deleteQuery, renameQuery } = require('../controllers/queryController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/query -> Accept user question, call LLMs, summarize, and save
router.post('/query', protect, createQuery);

// GET /api/history -> Return previous queries
router.get('/history', protect, getHistory);

// DELETE /api/history/:id -> Delete a specific query
router.delete('/history/:id', protect, deleteQuery);

// PATCH /api/history/:id/rename -> Rename a chat session
router.patch('/history/:id/rename', protect, renameQuery);

module.exports = router;
