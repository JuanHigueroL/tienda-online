// Importa el framework Express
const express = require('express');
// Importa el conector a MySQL
const mysql = require('mysql2');
// Importa el middleware CORS de seguridad para que la página web hable con el servidor (backend)
const cors = require('cors');

// Crea una instancia de Express
const app = express();

//activa CORS para el intercambio de datos entre el frontend y el backend
app.use(cors());
// permite que el servidor entienda los datos em formato JSON
app.use(express.json());

//Define la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'juan',
    database:'tienda-db'
});

//Inicia la conexión a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error de conexión:', err);
        return;
    }
    console.log('Conexión exitosa a MySQL');
})



// -------------------------------------  REGISTRO Y LOGIN DE USUARIOS ------------------------------------

//Crea la ruta de tipo POST para registrar un nuevo usuario en la base de datos
// req es la solicitud del cliente, res es la respuesta que el servidor enviará al cliente
app.post('/api/registro', (req, res) => {
    const { nombre, correo, contrasena } = req.body;
    const rol_id = 2; 

    const sql = "INSERT INTO usuarios (nombre, correo, contrasena, rol_id) VALUES (?, ?, ?, ?)";

    const sqlCheck ="SELECT * FROM usuarios WHERE nombre = ? OR correo =?";

    // Primero verificamos si el nombre o correo ya existe
    db.query(sqlCheck, [nombre, correo], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if(results.length > 0) {
            return res.status(400).json({ mensaje:"El nombre de usuario o correo ya está en uso" });
        } else {
            db.query(sql, [nombre, correo, contrasena, rol_id], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ mensaje: "Usuario registrado con éxito", id: result.insertId });
            });
        }
    }); 
});

app.post('/api/login', (req, res) => {
    const { identificador, contrasena } = req.body;

    // La consulta busca en ambas columnas usando el operador OR
    const sql = "SELECT id, nombre, correo, rol_id FROM usuarios WHERE (nombre = ? OR correo = ?) AND contrasena = ?";

    // Pasamos el identificador dos veces (para nombre y para correo) y la contraseña
    db.query(sql, [identificador, identificador, contrasena], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            res.json({
                mensaje: "Login exitoso",
                usuario: results[0]
            });
        } else {
            res.status(401).json({ mensaje: "Credenciales incorrectas" });
        }
    });
});

// ------------------------------------- CREACIÓN Y MODIFICACIÓN DE CATEGORÍAS ------------------------------------

app.get('/api/categorias', (req, res) => {
    const sql = "SELECT * FROM categorias";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/categorias', (req, res) =>{
    const { nombre } = req.body;
    const sql = "INSERT INTO categorias (nombre) VALUES (?)";
    const sqlCheck = "SELECT * FROM categorias WHERE nombre = ?";
    db.query(sqlCheck, [nombre], (err, results) => {
        if (err) return res.status(500).json ({ error : err.message});
        if (results.length > 0) {
            return res.status(400).json({ mensaje : "La categoría ya existe"});
        } else {
            db.query(sql, [nombre], (err, results) => {
            if (err) return res.status(500).json({ error: err.message});
            res.json({ mensaje: "Categoría creada con éxito", id: results.insertId });
        });
        }
    });
});



//Crea la ruta de tipo GET para solicitar la lista de productos a la base de datos
app.get('/api/productos', (req, res)=>{
    const sql = "SELECT * FROM productos";
    //Ejecuta la consulta SQL 
    db.query(sql, (err, results)=>{
        if (err) return res.status(500).json({ error: err.message});
        res.json(results);
    });
});

// Inicia el servidor en el puerto 3000
// listen es un método de Express que inicia el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


