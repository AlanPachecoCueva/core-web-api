const { auth, db } = require('../firebase.js');



async function createProject(author, teamName, name, description, teamMembers, estimatedEndDate) {
    try {
        const newProject = { author, teamName, name, description, teamMembers, estimatedEndDate }
        console.log("newProject: ", newProject);
        // Actualizar el usuario en Firebase Authentication

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

        db.collection('projects').add({
            author,
            teamName,
            name,
            description,
            teamMembers,
            estimatedEndDate,
            estado: "Creado",
            //Fecha actual
            startDate: dateString,
            //Valores iniciales que están vacíos
            realEndDate: "",
        })
            .then((docRef) => {
                console.log("Proyecto creado con ID: ", docRef.id);
                // Retornar un mensaje de éxito
                return docRef.id;

            })
            .catch((error) => {
                console.error("Error creando el proyecto: ", error);
                throw error;
            });

    } catch (error) {
        console.error('Error al crear proyecto:', error);
        throw error; // Lanzar el error para que sea capturado en el catch del enrutador
    }
}

//READ
// async function getAllProjects() {
//     try {
//       // Obtener la colección de usuarios en Firestore
//       const snapshot = await db.collection('projects').get();
//       const projects = snapshot.docs.map(doc => doc.data());
//       console.log('Proyectos obtenidos exitosamente:', projects);

//       // Retornar la lista de usuarios
//       return projects;
//     } catch (error) {
//       console.error('Error al obtener proyectos:', error);
//       throw error; // Lanzar el error para que sea capturado en el catch del enrutador
//     }
//   }

async function getAllProjects() {
    try {
        // Obtener la colección de proyectos en Firestore
        const snapshot = await db.collection('projects').get();
        const projects = snapshot.docs.map(doc => {
            // Agregar el ID del documento a los datos del proyecto
            return { id: doc.id, ...doc.data() };
        });
        console.log('Proyectos obtenidos exitosamente:', projects);

        // Retornar la lista de proyectos
        return projects;
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        throw error; // Lanzar el error para que sea capturado en el catch del enrutador
    }
}

async function getProject(id) {
    try {
        // Verificar si se proporcionó un ID de usuario
        if (!id) {
            console.error('ID de proyecto no proporcionado');
            return null;
        }

        // Obtener el documento del usuario en Firestore mediante su ID
        const collectionRef = await db.collection('projects');
        try {
            const doc = await collectionRef.doc(id).get();
            if (!doc.exists) {
                console.log('No se encontró ningún proyecto con el ID proporcionado');
                return null;
            }
            return doc.data();
        } catch (error) {
            console.error('Error al buscar el documento:', error);
            return null;
        }


        // // Verificar si se encontraron resultados
        // if (!querySnapshot.empty) {
        //     const projectDoc = querySnapshot.docs[0];
        //     const project = projectDoc.data();
        //     console.log('Proyecto obtenido exitosamente:', project);

        //     // Retornar el usuario obtenido
        //     return project;
        // } else {
        //     console.error('No se encontró el proyecto con el ID proporcionado:', id);
        //     return null;
        // }
    } catch (error) {
        console.error('Error al obtener proyecto por ID:', error);
        throw error; // Lanzar el error para que sea capturado en el catch del enrutador
    }
}

module.exports = { createProject, getAllProjects, getProject };