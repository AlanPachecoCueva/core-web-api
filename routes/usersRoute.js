// Definir rutas para usuarios
const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer");
//User methods
const {
  createUserAndSaveData,
  updateUser,
  deleteUser,
  getAllUsers,
  getUser,
} = require("../Firebase/methods/userMethods");

router.post("/create", async (req, res) => {
  try {
    const { email, password, name, surname, birthdate, city, isAdmin } =
      req.body;
    const user = await createUserAndSaveData(
      email,
      password,
      name,
      surname,
      birthdate,
      city,
      isAdmin
    );
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
});

router.post("/sendMail", async (req, res) => {
  try {
    // Configurar el transporte SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: "basedatosAP@outlook.com",
        pass: "basedatos2022!*",
      },
    });

    const { to, subject, text } = req.body;

    // Definir el contenido del correo
    const mailOptions = {
      from: "basedatosAP@outlook.com",
      to,
      subject,
      text,
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error al enviar el correo:", error);
        res.status(500).json({ message: "Error sending mail" });
      } else {
        console.log("Correo enviado:", info.response);

        res.status(201).json(info.response);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending mail" });
  }
});

router.put("/update", async (req, res) => {
  try {
    const { uid, email, name, surname, birthdate, city } = req.body;
    const result = await updateUser(uid, email, name, surname, birthdate, city);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resp = await deleteUser(id);
    if (resp) {
      res.status(200).send(`User with id ${id} has been deleted.`);
    } else {
      res.status(500).json({ message: "Error deleting user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting all users." });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: `Error getting user with ID: ${req.params.id}` });
  }
});

module.exports = router;
