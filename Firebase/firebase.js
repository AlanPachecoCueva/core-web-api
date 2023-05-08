// const { initializeApp } = require('firebase/app');
// const { getFirestore, collection, getDocs, doc, setDoc, query, where, updateDoc, deleteDoc, getDoc, addDoc } = require('firebase/firestore');
// const { getAuth, createUserWithEmailAndPassword, updateProfile} = require("firebase/auth");

// const firebaseConfig = {
//   apiKey: "AIzaSyBCSMzzP5UD-7g_Mi1FEOtfj2IUjZoQaYg",
//   authDomain: "ingweb-ap.firebaseapp.com",
//   projectId: "ingweb-ap",
//   storageBucket: "ingweb-ap.appspot.com",
//   messagingSenderId: "936544478001",
//   appId: "1:936544478001:web:563092b879350a2d878610",
//   measurementId: "G-WV9F4WD9QM"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth();

// module.exports = { auth, collection, db, getDocs, createUserWithEmailAndPassword, doc, setDoc, updateProfile, query, where, updateDoc, deleteDoc, getDoc, addDoc};


const admin = require('firebase-admin');

// Ruta al archivo de configuración de Firebase (descargado desde la consola de Firebase)
const rutaArchivoCredenciales = "../Firebase/config/ingweb-ap-firebase-adminsdk-yaj28-459f167cd9.json";

// Configurar las credenciales de Firebase
const credenciales = require(rutaArchivoCredenciales);

admin.initializeApp({
  credential: admin.credential.cert(credenciales),
  databaseURL: 'firebase-adminsdk-yaj28@ingweb-ap.iam.gserviceaccount.com' // Reemplaza <TU_PROYECTO_FIREBASE> con el nombre de tu proyecto en Firebase
});

// Ahora puedes usar el paquete firebase-admin para interactuar con Firebase en tu aplicación
// Por ejemplo:
const db = admin.firestore(); // Obtener una instancia de Firestore
const storage = admin.storage(); // Obtener una instancia de Cloud Storage
// Realizar operaciones con Firestore y Cloud Storage

const auth = admin.auth();

module.exports = {auth, db, storage};