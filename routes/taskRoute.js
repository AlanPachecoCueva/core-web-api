
// Definir rutas para proyectos
const express = require('express');
const router = express.Router();

//Task methods
const {  createTask, getAllTasksOfProject, getTask } = require("../Firebase/methods/taskMethods.js");



router.post('/create', async (req, res) => {
    try {
      console.log("body: ", req.body);
      const { projectId, author, name, description, estimatedEndDate, members, objectives } = req.body;
  
      const task = await createTask(projectId, author, name, description, estimatedEndDate, members, objectives);
      res.status(201).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating task: ', error });
    }
  });
  
  router.get('/:id', async (req, res) => {
    try {
        console.log("AWAWAWE");
      const tasks = await getAllTasksOfProject(req.params.id);
      console.log("Tasks: ", tasks);
      res.status(201).json(tasks);
    } catch (error) {
      console.log(error);
      res.status(500).send('Error obteniendo tareas');
    }
  });
  
  
  router.get('/task/:id', async (req, res) => {
    try {
      const task = await getTask(req.params.id);
      console.log("Task: ", task);
      res.status(201).json(task);
    } catch (error) {
      console.log(error);
      res.status(500).send('Error obteniendo tarea');
    }
  });
  
  
  module.exports = router;