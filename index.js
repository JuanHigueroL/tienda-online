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

//Crea la ruta de tipo GET para solicitar la lista de productos a la base de datos
// req es la solicitud del cliente, res es la respuesta que el servidor enviará al cliente
app.get('/api/productos', (req, res)=>{
    const sql = "SELECT * FROM productos";
    //Ejecuta la consulta SQL 
    db.query(sql, (err, results)=>{
        if (err) return res.status(500).json({ error: err.message});
        res.json(results);
    });
});

//Crea la ruta de tipo POST para registrar un nuevo usuario en la base de datos
app.post('/api/registro', (req, res) => {
    const { nombre, correo, contrasena } = req.body;
    const rol_id = 2; 

    const sql = "INSERT INTO usuarios (nombre, correo, contrasena, rol_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [nombre, correo, contrasena, rol_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "Usuario registrado con éxito", id: result.insertId });
    });
});

// Inicia el servidor en el puerto 3000
// listen es un método de Express que inicia el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});