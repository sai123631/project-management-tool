const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');

// Get all tasks for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a task
router.post('/project/:projectId', async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      projectId: req.params.projectId
    });
    await task.save();
    await updateProjectProgress(req.params.projectId);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await updateProjectProgress(task.projectId);
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        await Task.findByIdAndDelete(req.params.id);
        await updateProjectProgress(task.projectId);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function updateProjectProgress(projectId) {
    const tasks = await Task.find({ projectId });
    if (tasks.length === 0) return;
    
    const doneTasks = tasks.filter(t => t.status === 'Done').length;
    const progress = Math.round((doneTasks / tasks.length) * 100);
    
    await Project.findByIdAndUpdate(projectId, { progress });
}

module.exports = router;
