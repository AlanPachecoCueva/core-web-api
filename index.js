const express = require('express');
const app = express();
const cors = require('cors');

// Agregue el middleware de cors antes de definir las rutas
app.use(cors());
//const router = express.Router();


// Importar el enrutador de usuarios
const usersRouter = require('./routes/usersRoute');
app.use(express.json());
// Usar el enrutador para las rutas de usuarios
app.use('/users', usersRouter);



// Importar el enrutador de proyectos
const projectsRouter = require('./routes/projectRoute');
// Usar el enrutador para las rutas de proyectos
app.use('/projects', projectsRouter);


// Importar el enrutador de tareas
const tasksRouter = require('./routes/taskRoute');
// Usar el enrutador para las rutas de tareas
app.use('/tasks', tasksRouter);

// app.use(cors({
//     origin: 'http://127.0.0.1:5173'
//   }));
// router.get('/', async (req, res) => {
//     res.status(201).send("Bienvenido a la API para CRUD de usuarios");
//   });

app.listen(3000, () => {
    console.log('El servidor está corriendo en: http://localhost:3000');
});