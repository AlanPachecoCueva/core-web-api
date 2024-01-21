
// Definir rutas para proyectos
const express = require("express");
const router = express.Router();
const axios = require("axios");

require("dotenv").config();

const {
  encryptText, decryptText,
} = require("../Firebase/Encryption Service/encryption-methods.js");

async function encryptTextWithKMS(text) {
  try {
    const res = await encryptText(text);
    return res;
  } catch (error) {
    console.error("Error al cifrar en encryptTextWithKMS:", error);
    throw error; // Lanzar el error para que sea capturado en el catch del enrutador
  }
}

async function getContactsByName(name){
    console.log("Nombre a encriptar: ", name);
    encryptedName = await encryptTextWithKMS(name);
console.log("Nombre encriptado: ", encryptedName);
    const url = `http://localhost:5179/api/v1/ContactoUsuario/getByName/${encryptedName}`;

    let response = await axios.get(url);

    

    let contactosUsuario = response.data.texto;
    
//desencriptar lo obtenido
    usuariosDesencriptados = await decryptText(contactosUsuario);
    console.log("usuariosDesencriptados: ", usuariosDesencriptados);
    return usuariosDesencriptados;

}

router.get("/getByName/:name", async (req, res) => {
    try {
      const contactosUsuario = await getContactsByName(req.params.name);
    
      res.status(201).json(contactosUsuario);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error obteniendo contactosUsuario");
    }
  });




module.exports = router;
