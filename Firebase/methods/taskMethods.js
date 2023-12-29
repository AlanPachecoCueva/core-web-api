const { db, admin } = require("../firebase.js");
const { decryptText } = require("../Encryption Service/encryption-methods.js");

async function createTask(
  projectId,
  author,
  name,
  description,
  //startDate,
  //endDate,
  estimatedEndDate,
  //state,
  members,
  objectives
) {
  try {
    const newTask = {
      projectId,
      author,
      name,
      description,
      //startDate,
      //endDate,
      estimatedEndDate,
      //state,
      members,
      objectives,
    };
    console.log("newTask: ", newTask);

    // Setea la fecha de inicio como la fecha actual
    let currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();

    // Agrega un cero antes del número del día y mes si son menores a 10
    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }
    let dateString = day + "/" + month + "/" + year;

    db.collection("tasks")
      .add({
        projectId,
        author,
        name,
        description,
        startDate: dateString,
        endDate: "",
        estimatedEndDate,
        state: "On hold", //On hold, On process, QA, Done.
        members,
        objectives,
      })
      .then((docRef) => {
        console.log("Tarea creada con ID: ", docRef.id);
        // Retornar un mensaje de éxito
        return docRef.id;
      })
      .catch((error) => {
        console.error("Error creando tarea: ", error);
        throw error;
      });
  } catch (error) {
    console.error("Error al crear tarea:", error);
    throw error; // Lanzar el error para que sea capturado en el catch del enrutador
  }
}

async function getAllTasks() {
  try {
    const snapshot = await db.collection("tasks").get();

    const tasks = [];
    snapshot.forEach((doc) => {
      const task = doc.data();
      task.id = doc.id;
      tasks.push(task);
    });

    return tasks;
  } catch (error) {
    console.error("Error getting all tasks:", error);
    throw error; // Lanzar el error para que sea capturado en el catch del enrutador
  }
}

async function getAllTasksOfProject(projectId) {
  try {
    const snapshot = await db
      .collection("tasks")
      .where("projectId", "==", projectId)
      .get();

    const tasks = [];
    snapshot.forEach((doc) => {
      const task = doc.data();
      task.id = doc.id;
      tasks.push(task);
    });

    return tasks;
  } catch (error) {
    console.error(
      "Error al obtener tareas del proyecto: ",
      projectId,
      " | ",
      error
    );
    throw error; // Lanzar el error para que sea capturado en el catch del enrutador
  }
}

async function getTask(id) {
  try {
    // Verificar si se proporcionó un ID de usuario
    if (!id) {
      console.error("ID de tarea no proporcionado");
      return null;
    }

    // Obtener el documento del usuario en Firestore mediante su ID
    const collectionRef = await db.collection("tasks");
    try {
      const doc = await collectionRef.doc(id).get();
      if (!doc.exists) {
        console.log("No se encontró ninguna tarea con el ID proporcionado");
        return null;
      }

      const data = doc.data();
      data.id = doc.id;

      //Para desencriptar la descripción de la tarea
      data.description = await decryptText(data.description);

      return data;
    } catch (error) {
      console.error("Error al buscar el tarea:", error);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener tarea por ID:", error);
    throw error; // Lanzar el error para que sea capturado en el catch del enrutador
  }
}

//Delete task
async function deleteTask(id) {
  try {
    // Eliminar el documento de Firestore
    await db.collection("tasks").doc(id).delete();

    // Retornar un mensaje de éxito
    return true;
  } catch (error) {
    throw error; // Lanzar el error para que sea capturado en el catch del enrutador
  }
}

// //UPDATE
async function updateTask(
  id,
  name,
  description,
  estimatedEndDate,
  members,
  objectives,
  state
) {
  try {
    
    let result = null;
    if (state == "Done") {
      // Setea la fecha de fin como la fecha actual
      let currentDate = new Date();
      let day = currentDate.getDate();
      let month = currentDate.getMonth() + 1;
      let year = currentDate.getFullYear();

      // Agrega un cero antes del número del día y mes si son menores a 10
      if (day < 10) {
        day = "0" + day;
      }
      if (month < 10) {
        month = "0" + month;
      }
      let dateString = day + "/" + month + "/" + year;

      // Actualizar el documento en Firestore para el task con los datos proporcionados
      result = await db.collection("tasks").doc(id).update({
        name,
        description,
        estimatedEndDate,
        members,
        objectives,
        state,
        endDate: dateString,
      });
    } else {
      // Actualizar el documento en Firestore para el task con los datos proporcionados
      result = await db.collection("tasks").doc(id).update({
        name,
        description,
        estimatedEndDate,
        members,
        objectives,
        state,
        endDate: "",
      });
    }

    // Retornar un mensaje de éxito
    return result;
  } catch (error) {
    throw error; // Lanzar el error para que sea capturado en el catch del enrutador
  }
}

async function addComment(taskId, comment, userId) {
  try {
    // Obtiene la referencia al documento de "task"
    console.log("taskId: ", taskId);
    const taskRef = db.collection("tasks").doc(taskId);

    // Actualiza el documento de "task" para agregar el nuevo comentario al arreglo "comments"
    await taskRef.update({
      comments: admin.firestore.FieldValue.arrayUnion({
        userId: userId,
        comment: comment,
      }),
    });

    console.log("Nuevo comentario agregado correctamente");

    return { userId: userId, comment: comment }; // Retorna el nuevo comentario agregado
  } catch (error) {
    console.error("Error al agregar el comentario:", error);
    throw error;
  }
}

function getCommentsByTaskId(taskId) {
  const taskRef = db.collection("tasks").doc(taskId);

  // Obtiene los comentarios de la tarea
  return taskRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        // Retorna el arreglo de comentarios si existe
        const taskData = doc.data();
        return taskData.comments || [];
      } else {
        // Retorna un arreglo vacío si la tarea no existe
        return [];
      }
    })
    .catch((error) => {
      console.log("Error al obtener los comentarios:", error);
      return [];
    });
}

async function deleteComment(taskId, userId, comment) {
  const taskRef = db.collection("tasks").doc(taskId);

  return await taskRef
    .get()
    .then(async (doc) => {
      if (doc.exists) {
        const comments = doc.data().comments;

        // Filtrar los comentarios y eliminar el que coincida con los parámetros proporcionados
        const nuevosComentarios = comments.filter(
          (c) => c.userId !== userId || c.comment !== comment
        );

        //Actualizar el documento de la tarea con los nuevos comentarios
        taskRef
          .update({ comments: nuevosComentarios })
          .then(() => {
            console.log("Comentario eliminado correctamente");
          })
          .catch((error) => {
            console.error("Error al eliminar el comentario:", error);
          });


        //   const result = await db.collection('projects').doc(newProject.id).update({
        //     description: newProject.description,
        //     state: newProject.state,
        //     estimatedEndDate: newProject.estimatedEndDate,
        //     name: newProject.name,
        //     startDate: newProject.startDate,
        //     teamMembers: newProject.teamMembers,
        //     teamName: newProject.teamName,
        // });



        return true;
      } else {
        console.log("No se encontró la tarea con el ID proporcionado");
      }
    })
    .catch((error) => {
      console.error("Error al obtener la tarea:", error);
    });
}

module.exports = {
  createTask,
  getAllTasksOfProject,
  getTask,
  getAllTasks,
  deleteTask,
  updateTask,
  addComment,
  getCommentsByTaskId,
  deleteComment,
};
