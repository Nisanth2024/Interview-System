const Section = require('../models/Section');

// Get all sections for a user
const getSections = async (req, res) => {
  try {
    const sections = await Section.find({ 
      userId: req.user.id,
      isActive: true 
    }).sort({ order: 1, createdAt: 1 });
    
    res.json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new section
const createSection = async (req, res) => {
  try {
    console.log('Create section request body:', req.body);
    console.log('User from token:', req.user);
    
    const { name, details, duration, questionCount, order } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Check if user is authenticated and has a valid ID
    if (!req.user || (!req.user.id && !req.user._id)) {
      console.error('No valid user ID found in request');
      return res.status(401).json({ message: 'Authentication required - no user ID found' });
    }

    const userId = req.user.id || req.user._id;
    console.log('Using userId:', userId);

    // Auto-generate details if not provided or empty
    const finalDetails = (details && details.trim()) || `${duration || 0}m • ${questionCount || 0} Questions`;

    const section = new Section({
      name,
      details: finalDetails,
      duration: duration || 0,
      questionCount: questionCount || 0,
      order: order || 0,
      userId: userId
    });

    console.log('Section to save:', section);
    const savedSection = await section.save();
    console.log('Section saved successfully:', savedSection);
    res.status(201).json(savedSection);
  } catch (error) {
    console.error('Error creating section - Full error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a section
const updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, details, duration, questionCount, order } = req.body;

    const section = await Section.findOne({ 
      _id: id, 
      userId: req.user.id 
    });

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    section.name = name || section.name;
    section.details = details || section.details;
    section.duration = duration !== undefined ? duration : section.duration;
    section.questionCount = questionCount !== undefined ? questionCount : section.questionCount;
    section.order = order !== undefined ? order : section.order;

    const updatedSection = await section.save();
    res.json(updatedSection);
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a section (soft delete)
const deleteSection = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await Section.findOne({ 
      _id: id, 
      userId: req.user.id 
    });

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    section.isActive = false;
    await section.save();

    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reorder sections
const reorderSections = async (req, res) => {
  try {
    const { sectionIds } = req.body;

    if (!Array.isArray(sectionIds)) {
      return res.status(400).json({ message: 'Section IDs must be an array' });
    }

    // Update order for each section
    const updatePromises = sectionIds.map((sectionId, index) => 
      Section.findOneAndUpdate(
        { _id: sectionId, userId: req.user.id },
        { order: index },
        { new: true }
      )
    );

    await Promise.all(updatePromises);
    
    const updatedSections = await Section.find({ 
      userId: req.user.id,
      isActive: true 
    }).sort({ order: 1 });

    res.json(updatedSections);
  } catch (error) {
    console.error('Error reordering sections:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSections,
  createSection,
  updateSection,
  deleteSection,
  reorderSections
};
