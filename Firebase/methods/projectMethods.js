const { db } = require('../firebase.js');


async function createProject(author, teamName, name, description, teamMembers, estimatedEndDate) {
    try {

        /*------------------------FECHA------------------------ */
        //Genera fecha actual
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

        //Formatea la fecha generada
        let dateString = day + "/" + month + "/" + year;
        /*------------------------FECHA------------------------ */

        db.collection('projects').add({
            author,
            teamName,
            name,
            description,
            teamMembers,
            estimatedEndDate,
            state: "Created",
            //Fecha actual
            startDate: dateString,
            //Valores iniciales que están vacíos
            realEndDate: "",
        })
            .then((docRef) => {
                // Retornar un mensaje de éxito
                return docRef;
            })
            .catch((error) => {
                throw error;
            });

    } catch (error) {
        throw error; // Lanzar el error para que sea capturado en el catch del enrutador
    }
}

async function getAllProjects() {
    try {
        // Obtener la colección de proyectos en Firestore
        const snapshot = await db.collection('projects').get();
        const projects = snapshot.docs.map(doc => {
            // Agregar el ID del documento a los datos del proyecto
            return { id: doc.id, ...doc.data() };
        });

        // Retornar la lista de proyectos
        return projects;
    } catch (error) {
        throw error; // Lanzar el error para que sea capturado en el catch del enrutador
    }
}

async function getProject(id) {
    try {
        // Obtener el documento del usuario en Firestore mediante su ID
        const collectionRef = await db.collection('projects');

        const doc = await collectionRef.doc(id).get();
        if (!doc.exists) {
            throw error; // Lanzar el error para que sea capturado en el catch del enrutador
        }
        return doc.data();

    } catch (error) {
        throw error; // Lanzar el error para que sea capturado en el catch del enrutador
    }
}

//Delete project
async function deleteProject(id) {
    try {
        //Eliminar todas las tasks con un projectId equivalente al del proyecto que será eliminado
        await db.collection('tasks').where("projectId", '==', id).get()
            .then(snapshot => {
                const batch = db.batch();
                snapshot.docs.forEach(doc => batch.delete(doc.ref));
                return batch.commit();
            })
            .then(() => console.log(`All tasks with "projectId"=${id} are been deleted.`))
            .catch(error => {console.error(`Error deleting tasks of project ${id}: ${error}`); throw error;});

        // Eliminar el documento de Firestore
        await db.collection('projects').doc(id).delete();


        // Retornar un mensaje de éxito
        return true;
    } catch (error) {
        throw error; // Lanzar el error para que sea capturado en el catch del enrutador
    }
}

// //UPDATE
async function updateProject(id, description, state, estimatedEndDate, name, startDate, teamMembers, teamName) {
    try {
      const newProject = {
        id,
        description,
        state,
        estimatedEndDate,
        name,
        startDate,
        teamMembers,
        teamName,
      } 
  
      // Actualizar el documento en Firestore para el usuario con los datos proporcionados
      await db.collection('projects').doc(newProject.id).update({
        description:newProject.description,
        state:newProject.state,
        estimatedEndDate:newProject.estimatedEndDate,
        name:newProject.name,
        startDate:newProject.startDate,
        teamMembers:newProject.teamMembers,
        teamName:newProject.teamName,
      });
  
      // Retornar un mensaje de éxito
      return newUser;
    } catch (error) {
      throw error; // Lanzar el error para que sea capturado en el catch del enrutador
    }
  }
  

module.exports = { createProject, getAllProjects, getProject, deleteProject, updateProject };