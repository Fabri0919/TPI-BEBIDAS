const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "ecommerce.db");
const db = new sqlite3.Database(dbPath);

const products = [
  ["Jack Daniel's Old No. 7", 28500, "Whisky", 12, "https://tse1.mm.bing.net/th/id/OIP.f2o476UaSR087V3TvXmqnwHaHa?pid=Api&P=0&h=180"],
  ["Johnnie Walker Red Label", 22000, "Whisky", 15, "https://tse4.mm.bing.net/th/id/OIP.jzWUJQmFgAvi7h1UQYjMpgHaLp?pid=Api&P=0&h=180"],
  ["Chivas Regal 12 Anos", 41000, "Whisky", 8, "https://tse2.mm.bing.net/th/id/OIP.396f4cvVw6Icx6NpOGhmYAHaHa?pid=Api&P=0&h=180"],
  ["Absolut Vodka", 18000, "Vodka", 20, "https://tse1.mm.bing.net/th/id/OIP.S6YH5fQJ8K2kdWr6YRffKQHaMn?pid=Api&P=0&h=180"],
  ["Smirnoff Red", 12500, "Vodka", 25, "https://tse3.mm.bing.net/th/id/OIP.8fFU-E8FaFg5kErBQ9ZfgQHaHa?pid=Api&P=0&h=180"],
  ["Bombay Sapphire", 27000, "Gin", 10, "https://tse2.mm.bing.net/th/id/OIP.LG9Z_ZTjqITiNcaTeWE4oQHaHa?pid=Api&P=0&h=180"],
  ["Tanqueray London Dry", 24000, "Gin", 12, "https://tse4.mm.bing.net/th/id/OIP.hlZFQZz2oyQkmWF1I_klIAHaHa?pid=Api&P=0&h=180"],
  ["Bacardi Carta Blanca", 15000, "Ron", 22, "https://tse4.mm.bing.net/th/id/OIP.C1FUwEFCOj2cEfcVVF1GPgHaJQ?pid=Api&P=0&h=180"],
  ["Trapiche Malbec", 8500, "Vino", 30, "https://tse3.mm.bing.net/th/id/OIP.lZQ60BvJkiFA7tdt7GK1zQHaHa?pid=Api&P=0&h=180"],
  ["Quilmes Clasica", 2500, "Cerveza", 50, "https://tse4.mm.bing.net/th/id/OIP.O2veGdsoxdgcmfelGB0aSgHaHa?pid=Api&P=0&h=180"],
];

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('super-admin', 'admin', 'user')),
    active INTEGER NOT NULL DEFAULT 1
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    total REAL NOT NULL DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);

  db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
    if (!err && row.count === 0) {
      const insert = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
      insert.run("Super Admin", "super@espiritulibre.com", "Admin123", "super-admin");
      insert.run("Administrador", "admin@espiritulibre.com", "Admin123", "admin");
      insert.run("Cliente Demo", "cliente@espiritulibre.com", "Cliente123", "user");
      insert.finalize();
    }
  });

  db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
    if (!err && row.count === 0) {
      const insert = db.prepare("INSERT INTO products (name, price, category, stock, image) VALUES (?, ?, ?, ?, ?)");
      products.forEach((product) => insert.run(product));
      insert.finalize();
    }
  });
});

module.exports = db;
