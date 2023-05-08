const { auth, db} = require('../firebase.js');



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

    console.log('Usuario creado exitosamente:', usuarioCreado.toJSON());
    return usuarioCreado;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return false;
  }
}




//READ
async function getAllUsers() {
  try {
    // Obtener la colección de usuarios en Firestore
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => doc.data());
    console.log('Usuarios obtenidos exitosamente:', users);

    // Retornar la lista de usuarios
    return users;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error; // Lanzar el error para que sea capturado en el catch del enrutador
  }
}


async function getUser(uid) {
  try {
    // Verificar si se proporcionó un ID de usuario
    if (!uid) {
      console.error('ID de usuario no proporcionado');
      return null;
    }

    // Obtener el documento del usuario en Firestore mediante su ID
    const querySnapshot = await db.collection('users').where('uid', '==', uid).get();

    // Verificar si se encontraron resultados
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const user = userDoc.data();
      console.log('Usuario obtenido exitosamente:', user);

      // Retornar el usuario obtenido
      return user;
    } else {
      console.error('No se encontró el usuario con el ID proporcionado:', uid);
      return null;
    }
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
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
    console.log("New User", newUser);
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

    console.log('Datos de usuario actualizados exitosamente:', newUser.uid);

    // Retornar un mensaje de éxito
    return newUser;
  } catch (error) {
    console.error('Error al actualizar datos de usuario:', error);
    throw error; // Lanzar el error para que sea capturado en el catch del enrutador
  }
}




// //DELETE


async function deleteUser(id) {
  try {
    // Eliminar el usuario de Firebase Authentication
    await auth.deleteUser(id);
    console.log('Usuario eliminado de Firebase Authentication:', id);

    // Eliminar el documento de Firestore para el usuario
    await db.collection('users').doc(id).delete();
    console.log('Documento de usuario eliminado de Firestore:', id);

    // Retornar un mensaje de éxito
    return 'Usuario eliminado exitosamente';
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error; // Lanzar el error para que sea capturado en el catch del enrutador
  }
}

module.exports = { createUserAndSaveData, updateUser, deleteUser, getAllUsers, getUser };
//, signIn, getAllUsers, updateUser, deleteUser, getUser 




