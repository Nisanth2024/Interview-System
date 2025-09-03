const express = require('express');
const candidatesController = require('../controllers/candidatesController');
const router = express.Router();

console.log('candidates.js router loaded');


// Middleware to require authentication and set req.user (assumes JWT auth)
const requireAuth = require('../middleware/requireAuth.js');
router.use(requireAuth);


// Get all candidates for the logged-in user
router.get('/', candidatesController.getAllCandidates);

// Add a new candidate for the logged-in user
router.post('/', candidatesController.addCandidate);

// Update a candidate (user-specific)
router.put('/:id', candidatesController.updateCandidate);

// Delete a candidate (user-specific)
router.delete('/:id', candidatesController.deleteCandidate);

// Test route
router.get('/test', (req, res) => res.json({ ok: true }));

module.exports = router;
