const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

// Create a new note - Admin only
router.post('/', auth, admin, async (req, res) => {
  const { title, classLevel, subject, chapter, order, googleDriveLink } = req.body;
  console.log('Creating note with data:', { title, classLevel, subject, chapter, order, googleDriveLink });
  try {
    const note = new Note({ title, classLevel, subject, chapter, order, googleDriveLink });
    await note.save();
    console.log('Note saved successfully:', note);
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save note' });
  }
});

// Get all notes - Public
router.get('/', async (req, res) => {
  const { classLevel, subject, title } = req.query;
  const query = {};
  if (classLevel) query.classLevel = classLevel;
  if (subject) query.subject = subject;
  if (title) query.title = { $regex: title, $options: 'i' };
  try {
    // Sort by order (ascending) then by title (ascending)
    const notes = await Note.find(query).sort({ order: 1, title: 1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Update a note - Admin only
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Delete a note - Admin only
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

module.exports = router;