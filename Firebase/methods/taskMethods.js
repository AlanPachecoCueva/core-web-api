const { db } = require('../firebase.js');



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
            objectives
        }
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



        db.collection('tasks').add({
            projectId,
            author,
            name,
            description,
            startDate: dateString,
            endDate: "",
            estimatedEndDate,
            state: "On hold", //On hold, On process, QA, Done.
            members,
            objectives
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
        console.error('Error al crear tarea:', error);
        throw error; // Lanzar el error para que sea capturado en el catch del enrutador
    }
}

async function getAllTasksOfProject(projectId) {
    try {
        const snapshot = await db.collection('tasks').where('projectId', '==', projectId).get();

        const tasks = [];
        snapshot.forEach(doc => {
            const task = doc.data();
            task.id = doc.id;
            tasks.push(task);
        });

        return tasks;
    } catch (error) {
        console.error('Error al obtener tareas del proyecto: ',projectId," | ", error);
        throw error; // Lanzar el error para que sea capturado en el catch del enrutador
    }
}

async function getTask(id) {
    try {
        // Verificar si se proporcionó un ID de usuario
        if (!id) {
            console.error('ID de tarea no proporcionado');
            return null;
        }

        // Obtener el documento del usuario en Firestore mediante su ID
        const collectionRef = await db.collection('tasks');
        try {
            const doc = await collectionRef.doc(id).get();
            if (!doc.exists) {
                console.log('No se encontró ninguna tarea con el ID proporcionado');
                return null;
            }
            return doc.data();
        } catch (error) {
            console.error('Error al buscar el tarea:', error);
            return null;
        }
    } catch (error) {
        console.error('Error al obtener tarea por ID:', error);
        throw error; // Lanzar el error para que sea capturado en el catch del enrutador
    }
}

module.exports = { createTask, getAllTasksOfProject, getTask };