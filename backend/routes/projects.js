const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a project
router.post('/', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
    try {
        await Task.deleteMany({ projectId: req.params.id });
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project and associated tasks deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update project progress
router.patch('/:id/progress', async (req, res) => {
    try {
        const { progress } = req.body;
        const project = await Project.findByIdAndUpdate(req.params.id, { progress }, { new: true });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
