
// Definir rutas para proyectos
const express = require('express');
const router = express.Router();

//User methods
const { createProject, getAllProjects, getProject } = require('../Firebase/methods/projectMethods.js');




router.post('/create', async (req, res) => {
  try {
    console.log("body: ", req.body);
    const { author, teamName, name, description, teamMembers, estimatedEndDate } = req.body;

    const user = await createProject(author, teamName, name, description, teamMembers, estimatedEndDate);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating project: ', error });
  }
});

router.get('/', async (req, res) => {
  try {
    const projects = await getAllProjects();
    console.log("Projects: ", projects);
    res.status(201).json(projects);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error obteniendo proyectos');
  }
});


router.get('/project/:id', async (req, res) => {
  try {
    const project = await getProject(req.params.id);
    console.log("Project: ", project);
    res.status(201).json(project);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error obteniendo proyecto');
  }
});


module.exports = router;
