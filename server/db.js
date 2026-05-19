const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'ecommerce.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
        db.run(`CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            precio REAL NOT NULL,
            categoria TEXT,
            imagen TEXT
        )`, (err) => {
            if (err) {
                console.error('Error al crear la tabla', err.message);
            } else {
                // Insertar datos de prueba si está vacía
                db.get("SELECT count(*) as count FROM productos", (err, row) => {
                    if (row && row.count === 0) {
                        const insert = 'INSERT INTO productos (nombre, precio, categoria, imagen) VALUES (?, ?, ?, ?)';
                        db.run(insert, ['Fernet Branca 750ml', 8500, 'Aperitivo', '']);
                        db.run(insert, ['Gin Bombay Sapphire 750ml', 15000, 'Gin', '']);
                        db.run(insert, ['Vodka Absolut 700ml', 12000, 'Vodka', '']);
                        db.run(insert, ['Whisky Johnnie Walker Red Label', 18000, 'Whisky', '']);
                        db.run(insert, ['Ron Havana Club 3 Años', 9500, 'Ron', '']);
                        db.run(insert, ['Tequila Jose Cuervo Especial', 13000, 'Tequila', '']);
                    }
                });
            }
        });
    }
});

module.exports = db;