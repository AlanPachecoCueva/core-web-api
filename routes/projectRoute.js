
// Definir rutas para proyectos
const express = require('express');
const router = express.Router();

//User methods
const { createProject, getAllProjects, getProject, deleteProject, updateProject } = require('../Firebase/methods/projectMethods.js');


router.post('/create', async (req, res) => {
  try {
    const { author, teamName, name, description, teamMembers, estimatedEndDate } = req.body;

    const project = await createProject(author, teamName, name, description, teamMembers, estimatedEndDate);
    res.status(201).json(project);
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
    res.status(500).send('Error getting all projects');
  }
});


router.get('/project/:id', async (req, res) => {
  try {
    const project = await getProject(req.params.id);

    res.status(201).json(project);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Error getting project with ID: ${req.params.id} `);
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resp = await deleteProject(id);
    if(resp == true){
      res.status(200).send(`Project with id ${id} has been deleted.`);
    }else{
      res.status(400).send("Unknow error.");
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error deleting project: ${error}`);
  }
});

router.put('/update', async (req, res) => {
  try {
    const { id, description, state, estimatedEndDate, name, startDate, teamMembers, teamName } = req.body;
    const result = await updateProject(id, description, state, estimatedEndDate, name, startDate, teamMembers, teamName);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating project.' });
  }
});

module.exports = router;
