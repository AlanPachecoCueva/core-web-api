const { auth, db} = require('../firebase.js');


//Create
async function createUserAndSaveData(email, password, name, surname, birthdate, city, isAdmin) {
  try {
    // Crear el usuario en Firebase Authentication
    const usuarioCreado = await auth.createUser({
      email: email,
      password: password,
      displayName: name + " " + surname
    });

    // Obtener el UID del usuario creado
    const uid = usuarioCreado.uid;

    // Crear un documento en Firestore para el usuario con los datos proporcionados
    await db.collection('users').doc(uid).set({
      email: email,
      name: name,
      surname: surname,
      birthdate: birthdate,
      city: city,
      isAdmin: isAdmin,
      uid: uid
    });
    return usuarioCreado;
  } catch (error) {
    return false;
  }
}




//READ
async function getAllUsers() {
  try {
    // Obtener la colección de usuarios en Firestore
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => doc.data());
    // Retornar la lista de usuarios
    return users;
  } catch (error) {
    throw error; // Lanzar el error para que sea capturado en el catch del enrutador
  }
}


async function getUser(uid) {
  try {
    // Obtener el documento del usuario en Firestore mediante su ID
    const querySnapshot = await db.collection('users').where('uid', '==', uid).get();

    // Verificar si se encontraron resultados
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const user = userDoc.data();

      // Retornar el usuario obtenido
      return user;
    } else {
      throw new Error(`User with ID: ${uid} not found`);
    }
  } catch (error) {
    throw error; // Lanzar el error para que sea capturado en el catch del enrutador
  }
}



// //UPDATE

// Actualizar los datos de un usuario existente en Firebase Authentication y Firestore
async function updateUser(uid, email, name, surname, birthdate, city) {
  try {
    const newUser = {
      uid: uid,
      email: email,
      name: name,
      surname: surname,
      birthdate: birthdate,
      city: city
    } 
    // Actualizar el usuario en Firebase Authentication
    await auth.updateUser(newUser.uid, {
      email: newUser.email,
      displayName: newUser.name + " " + newUser.surname
    });

    // Actualizar el documento en Firestore para el usuario con los datos proporcionados
    await db.collection('users').doc(newUser.uid).update({
      email: newUser.email,
      name: newUser.name,
      surname: newUser.surname,
      birthdate: newUser.birthdate,
      city: newUser.city
    });

    // Retornar un mensaje de éxito
    return newUser;
  } catch (error) {
    throw error; // Lanzar el error para que sea capturado en el catch del enrutador
  }
}




//DELETE
async function deleteUser(id) {
  try {
    // Eliminar el usuario de Firebase Authentication
    await auth.deleteUser(id);
    // Eliminar el documento de Firestore para el usuario
    await db.collection('users').doc(id).delete();
    // Retornar un mensaje de éxito
    return true;
  } catch (error) {
    throw error; // Lanzar el error para que sea capturado en el catch del enrutador
  }
}

module.exports = { createUserAndSaveData, updateUser, deleteUser, getAllUsers, getUser };
//, signIn, getAllUsers, updateUser, deleteUser, getUser 




