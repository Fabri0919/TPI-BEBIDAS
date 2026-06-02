const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const tokens = new Map();

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function callback(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });

const publicUser = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

const auth = (roles = []) => (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");
  const user = tokens.get(token);

  if (!user) return res.status(401).json({ message: "Debe iniciar sesion." });
  if (roles.length && !roles.includes(user.role)) {
    return res.status(403).json({ message: "No tiene permisos para esta accion." });
  }

  req.user = user;
  next();
};

app.get("/", (req, res) => {
  res.json({ message: "API Espiritu Libre funcionando" });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await get("SELECT * FROM users WHERE email = ? AND active = 1", [email]);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Email o contrasena incorrectos." });
  }

  const token = `${user.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  tokens.set(token, publicUser(user));
  res.json({ token, user: publicUser(user) });
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Complete todos los campos." });
  }

  try {
    const result = await run(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')",
      [name.trim(), email.trim().toLowerCase(), password],
    );
    const user = await get("SELECT id, name, email, role, active FROM users WHERE id = ?", [result.id]);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: "Ese email ya esta registrado." });
  }
});

app.get("/api/products", async (req, res) => {
  const products = await all("SELECT * FROM products ORDER BY category, name");
  res.json(products);
});

app.post("/api/products", auth(["admin", "super-admin"]), async (req, res) => {
  const { name, price, category, stock, image } = req.body;
  if (!name || !category || Number(price) <= 0 || Number(stock) < 0) {
    return res.status(400).json({ message: "Revise nombre, categoria, precio y stock." });
  }

  const result = await run(
    "INSERT INTO products (name, price, category, stock, image) VALUES (?, ?, ?, ?, ?)",
    [name.trim(), Number(price), category.trim(), Number(stock), image || ""],
  );
  const product = await get("SELECT * FROM products WHERE id = ?", [result.id]);
  res.status(201).json(product);
});

app.put("/api/products/:id", auth(["admin", "super-admin"]), async (req, res) => {
  const { name, price, category, stock, image } = req.body;
  if (!name || !category || Number(price) <= 0 || Number(stock) < 0) {
    return res.status(400).json({ message: "Revise nombre, categoria, precio y stock." });
  }

  await run(
    "UPDATE products SET name = ?, price = ?, category = ?, stock = ?, image = ? WHERE id = ?",
    [name.trim(), Number(price), category.trim(), Number(stock), image || "", req.params.id],
  );
  const product = await get("SELECT * FROM products WHERE id = ?", [req.params.id]);
  res.json(product);
});

app.delete("/api/products/:id", auth(["admin", "super-admin"]), async (req, res) => {
  await run("DELETE FROM products WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

app.get("/api/users", auth(["super-admin"]), async (req, res) => {
  const users = await all("SELECT id, name, email, role, active FROM users ORDER BY role, name");
  res.json(users);
});

app.post("/api/users", auth(["super-admin"]), async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !["super-admin", "admin", "user"].includes(role)) {
    return res.status(400).json({ message: "Datos de usuario invalidos." });
  }

  try {
    const result = await run(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name.trim(), email.trim().toLowerCase(), password, role],
    );
    const user = await get("SELECT id, name, email, role, active FROM users WHERE id = ?", [result.id]);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: "Ese email ya existe." });
  }
});

app.put("/api/users/:id", auth(["super-admin"]), async (req, res) => {
  const { name, email, role, active } = req.body;
  if (!name || !email || !["super-admin", "admin", "user"].includes(role)) {
    return res.status(400).json({ message: "Datos de usuario invalidos." });
  }

  await run(
    "UPDATE users SET name = ?, email = ?, role = ?, active = ? WHERE id = ?",
    [name.trim(), email.trim().toLowerCase(), role, active ? 1 : 0, req.params.id],
  );
  const user = await get("SELECT id, name, email, role, active FROM users WHERE id = ?", [req.params.id]);
  res.json(user);
});

app.delete("/api/users/:id", auth(["super-admin"]), async (req, res) => {
  await run("UPDATE users SET active = 0 WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

app.get("/api/orders", auth(["user", "admin", "super-admin"]), async (req, res) => {
  const onlyMine = req.user.role === "user";
  const orders = await all(
    `SELECT orders.*, users.name AS user_name, users.email AS user_email
     FROM orders JOIN users ON users.id = orders.user_id
     ${onlyMine ? "WHERE user_id = ?" : ""}
     ORDER BY date DESC, id DESC`,
    onlyMine ? [req.user.id] : [],
  );

  for (const order of orders) {
    order.items = await all(
      `SELECT order_items.*, products.name, products.image
       FROM order_items JOIN products ON products.id = order_items.product_id
       WHERE order_id = ?`,
      [order.id],
    );
  }

  res.json(orders);
});

app.post("/api/orders", auth(["user", "admin", "super-admin"]), async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "El pedido debe tener productos." });
  }

  let total = 0;
  const checkedItems = [];
  for (const item of items) {
    const product = await get("SELECT * FROM products WHERE id = ?", [item.productId]);
    const quantity = Number(item.quantity);
    if (!product || quantity <= 0 || product.stock < quantity) {
      return res.status(400).json({ message: "Hay productos sin stock suficiente." });
    }
    total += product.price * quantity;
    checkedItems.push({ product, quantity });
  }

  const result = await run(
    "INSERT INTO orders (user_id, date, status, total) VALUES (?, ?, 'pending', ?)",
    [req.user.id, new Date().toISOString().slice(0, 10), total],
  );

  for (const item of checkedItems) {
    await run(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
      [result.id, item.product.id, item.quantity, item.product.price],
    );
    await run("UPDATE products SET stock = stock - ? WHERE id = ?", [item.quantity, item.product.id]);
  }

  const order = await get("SELECT * FROM orders WHERE id = ?", [result.id]);
  res.status(201).json(order);
});

app.put("/api/orders/:id", auth(["admin", "super-admin"]), async (req, res) => {
  const { status } = req.body;
  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    return res.status(400).json({ message: "Estado invalido." });
  }

  await run("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id]);
  const order = await get("SELECT * FROM orders WHERE id = ?", [req.params.id]);
  res.json(order);
});

app.delete("/api/orders/:id", auth(["super-admin"]), async (req, res) => {
  await run("DELETE FROM order_items WHERE order_id = ?", [req.params.id]);
  await run("DELETE FROM orders WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
