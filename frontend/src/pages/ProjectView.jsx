import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, Clock, User, Trash2 } from 'lucide-react';

const ProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignee: '', deadline: '', status: 'Todo' });

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects/${id}`),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tasks/project/${id}`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tasks/project/${id}`, newTask);
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', assignee: '', deadline: '', status: 'Todo' });
      fetchProjectAndTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tasks/${taskId}`, { status });
      fetchProjectAndTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects/${id}`);
        navigate('/');
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  if (!project) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading...</div>;

  const columns = ['Todo', 'In Progress', 'Done'];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          <ArrowLeft size={24} />
        </Link>
        <h2 style={{ margin: 0, flex: 1 }}>{project.title}</h2>
        <button className="btn btn-secondary" onClick={handleDeleteProject} style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '0.5rem 1rem' }}>
          <Trash2 size={16} /> Delete
        </button>
        <button className="btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Add Task
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Project Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {columns.map(status => (
          <div key={status} className="glass-card" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
            <h3 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {status}
              <span style={{ fontSize: '0.8rem', background: 'var(--card-bg)', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>
                {tasks.filter(t => t.status === status).length}
              </span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task._id} className="glass-card" style={{ padding: '1rem', background: 'var(--card-bg)' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>{task.title}</h4>
                  {task.description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      {task.description}
                    </p>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <User size={14} /> {task.assignee || 'Unassigned'}
                    </span>
                    {task.deadline && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={14} /> {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <select 
                    value={task.status} 
                    onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                    style={{ marginBottom: 0, padding: '0.5rem', fontSize: '0.85rem' }}
                  >
                    {columns.map(col => <option key={col} value={col}>{col}</option>)}
                  </select>
                </div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 && (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  No tasks here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Task</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateTask}>
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Task Description"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                rows="3"
              ></textarea>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="Assignee Name"
                  value={newTask.assignee}
                  onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
                />
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectView;
