/**
 * Idempotent seed script for Dealer's Drinks.
 * Creates categories, products, and default users.
 * Safe to run multiple times — uses findOrCreate.
 *
 * Usage: node src/seeders/seed.js
 */
require('dotenv').config()

const bcrypt = require('bcryptjs')
const path = require('path')
const { sequelize, Categoria, Producto, Usuario } = require('../models')
const env = require('../config/env')
const catalogo = require('./catalogo.json')

const CATEGORIAS = [
  { nombre: 'Whisky', slug: 'whisky', descripcion: 'Whiskies de todo el mundo' },
  { nombre: 'Gin', slug: 'gin', descripcion: 'Ginebras premium nacionales e importadas' },
  { nombre: 'Vodka', slug: 'vodka', descripcion: 'Vodkas de primera calidad' },
  { nombre: 'Ron', slug: 'ron', descripcion: 'Rones clásicos y añejos' },
  { nombre: 'Licores', slug: 'licores', descripcion: 'Licores y cremas' },
  { nombre: 'Varios', slug: 'varios', descripcion: 'Bitters, vermouths, tequilas y más' },
]

const DEFAULT_USERS = [
  {
    nombre: 'Super Admin',
    email: env.SEED_SUPER_ADMIN_EMAIL || 'super-admin@dealers.local',
    password: env.SEED_SUPER_ADMIN_PASSWORD || 'Demo1234!',
    rol: 'super-admin',
  },
  {
    nombre: 'Admin Dealers',
    email: 'admin@dealers.local',
    password: 'Demo1234!',
    rol: 'admin',
  },
  {
    nombre: 'Cliente Demo',
    email: 'cliente@dealers.local',
    password: 'Demo1234!',
    rol: 'cliente',
  },
]

async function run() {
  console.log('=================================================')
  console.log('  Dealer\'s Drinks — Seed Script')
  console.log('=================================================')

  // Wait for models to sync
  await new Promise((resolve) => setTimeout(resolve, 1500))

  let catsCreated = 0
  let catsExisting = 0

  // Step 1: Create categories
  console.log('\n[1/3] Seeding categorías...')
  const categoriaMap = {}

  for (const cat of CATEGORIAS) {
    const [instance, created] = await Categoria.findOrCreate({
      where: { nombre: cat.nombre },
      defaults: { slug: cat.slug, descripcion: cat.descripcion, activo: true },
    })
    categoriaMap[cat.nombre] = instance.id

    if (created) {
      catsCreated++
      console.log(`  [+] Categoría creada: ${cat.nombre}`)
    } else {
      catsExisting++
      categoriaMap[cat.nombre] = instance.id
      console.log(`  [=] Ya existía: ${cat.nombre}`)
    }
  }

  // Step 2: Create products
  console.log('\n[2/3] Seeding productos...')
  let prodsCreated = 0
  let prodsExisting = 0

  for (const prod of catalogo) {
    const categoriaId = categoriaMap[prod.categoria_nombre]

    if (!categoriaId) {
      console.warn(`  [!] Categoría no encontrada para "${prod.nombre}": ${prod.categoria_nombre}`)
      continue
    }

    const [instance, created] = await Producto.findOrCreate({
      where: {
        nombre: prod.nombre,
        volumen_ml: prod.volumen_ml,
      },
      defaults: {
        descripcion: prod.descripcion || null,
        precio_centavos: prod.precio_centavos,
        stock: prod.stock !== undefined ? prod.stock : 50,
        imagen_url: null,
        subcategoria: prod.subcategoria || null,
        categoria_id: categoriaId,
        activo: true,
      },
    })

    if (created) {
      prodsCreated++
    } else {
      prodsExisting++
    }
  }

  console.log(`  Productos creados: ${prodsCreated}`)
  console.log(`  Productos ya existentes: ${prodsExisting}`)

  // Step 3: Create default users
  console.log('\n[3/3] Seeding usuarios...')
  let usersCreated = 0
  let usersExisting = 0

  for (const u of DEFAULT_USERS) {
    const existing = await Usuario.findOne({ where: { email: u.email } })

    if (existing) {
      usersExisting++
      console.log(`  [=] Ya existía: ${u.email} (${u.rol})`)
    } else {
      const password_hash = await bcrypt.hash(u.password, 10)
      await Usuario.create({
        nombre: u.nombre,
        email: u.email,
        password_hash,
        rol: u.rol,
        activo: true,
      })
      usersCreated++
      console.log(`  [+] Usuario creado: ${u.email} (${u.rol})`)
    }
  }

  // Summary
  console.log('\n=================================================')
  console.log('  SEED COMPLETADO')
  console.log('=================================================')

  const totalCats = await Categoria.count()
  const totalProds = await Producto.count()
  const totalUsers = await Usuario.count()

  console.log(`  Categorías totales : ${totalCats}`)
  console.log(`  Productos totales  : ${totalProds}`)
  console.log(`  Usuarios totales   : ${totalUsers}`)
  console.log('\n  Credenciales de acceso:')
  console.log(`  Super-admin : ${env.SEED_SUPER_ADMIN_EMAIL || 'super-admin@dealers.local'} / ${env.SEED_SUPER_ADMIN_PASSWORD || 'Demo1234!'}`)
  console.log('  Admin       : admin@dealers.local / Demo1234!')
  console.log('  Cliente     : cliente@dealers.local / Demo1234!')
  console.log('=================================================\n')

  process.exit(0)
}

run().catch((err) => {
  console.error('[SEED ERROR]', err)
  process.exit(1)
})
