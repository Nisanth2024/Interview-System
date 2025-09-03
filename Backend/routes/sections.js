const express = require('express');
const router = express.Router();
const { 
  getSections, 
  createSection, 
  updateSection, 
  deleteSection, 
  reorderSections 
} = require('../controllers/sectionsController');
const requireAuth = require('../middleware/requireAuth');

// Apply authentication middleware to all routes
router.use(requireAuth);

// GET /api/sections - Get all sections for authenticated user
router.get('/', getSections);

// POST /api/sections - Create a new section
router.post('/', createSection);

// PUT /api/sections/:id - Update a section
router.put('/:id', updateSection);

// DELETE /api/sections/:id - Delete a section
router.delete('/:id', deleteSection);

// PUT /api/sections/reorder - Reorder sections
router.put('/reorder', reorderSections);

module.exports = router;
