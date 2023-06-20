// Definir rutas para proyectos
const express = require("express");
const router = express.Router();

//Task methods
const {
  createTask,
  getAllTasksOfProject,
  getTask,
  getAllTasks,
  deleteTask,
  addComment,
  getCommentsByTaskId,
  deleteComment,
  updateTask
} = require("../Firebase/methods/taskMethods.js");

router.post("/create", async (req, res) => {
  try {
    console.log("body: ", req.body);
    const {
      projectId,
      author,
      name,
      description,
      estimatedEndDate,
      members,
      objectives,
    } = req.body;

    const task = await createTask(
      projectId,
      author,
      name,
      description,
      estimatedEndDate,
      members,
      objectives
    );
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating task: ", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    console.log("AWAWAWE");
    const tasks = await getAllTasksOfProject(req.params.id);
    console.log("Tasks: ", tasks);
    res.status(201).json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error obteniendo tareas");
  }
});

router.get("/task/:id", async (req, res) => {
  try {
    const task = await getTask(req.params.id);
    console.log("Task: ", task);
    res.status(201).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error obteniendo tarea");
  }
});

router.get("/", async (req, res) => {
  try {
    const tasks = await getAllTasks();
    console.log("tasks: ", tasks);
    res.status(201).json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting all tasks");
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resp = await deleteTask(id);
    if (resp == true) {
      res.status(200).send(`Task with id ${id} has been deleted.`);
    } else {
      res.status(400).send("Unknow error.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error deleting task: ${error}`);
  }
});

router.put("/update", async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      estimatedEndDate,
      members,
      objectives,
      state,
    } = req.body;
    const result = await updateTask(
      id,
      name,
      description,
      estimatedEndDate,
      members,
      objectives,
      state
    );
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating task." });
  }
});

router.put("/addComment", async (req, res) => {
  try {
    console.log("body: ", req.body);
    const { taskId, comment, userId } = req.body;

    const task = await addComment(taskId, comment, userId);
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding comment: ", error });
  }
});

router.get("/getComments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await getCommentsByTaskId(id);
    console.log("comments: ", comments);
    res.status(201).json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting all comments");
  }
});

router.delete("/deleteComment", async (req, res) => {
  const { taskId, comment, userId } = req.body;
  try {
    const resp = await deleteComment(taskId, userId, comment);
    console.log("resp eliminar: ", resp);
    if (resp == true) {
      res.status(200).send(`Comment ${comment} has been deleted.`);
    } else {
      res.status(400).send("Unknow error.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error deleting comment: ${error}`);
  }
});

module.exports = router;
