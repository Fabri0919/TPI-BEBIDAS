const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Ruta base
app.get('/', (req, res) => {
    res.json({ message: "API de E-commerce de Bebidas Espirituosas" });
});

// Obtener todos los productos
app.get('/api/productos', (req, res) => {
    const sql = "SELECT * FROM productos";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});