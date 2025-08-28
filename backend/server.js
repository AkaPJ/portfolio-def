import express from 'express';
import cors from 'cors';
import { openDb } from './databaselLocal.js';
import pool from './database.js';
import dotenv from 'dotenv';

dotenv.config();

let db; // referencia global

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    "https://jordimarti.netlify.app",
    "http://localhost:5500"
  ]
}));

app.use(express.json());

async function initDb() {
    db = await openDb();
    await db.exec(`CREATE TABLE IF NOT EXISTS mensajes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT,
            apellido TEXT,
            email TEXT,
            mensaje TEXT,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log('Base de datos lista');
}
initDb().catch(err => {
    console.error('Error inicializando la BD:', err);
    process.exit(1);
});

app.post('/enviar', async (req, res) => {
    try {
    const {nombre, apellido, email, mensaje} = req.body;
    
    const result = await pool.query("INSERT INTO mensajes (nombre, apellido, email, mensaje) VALUES ($1,$2,$3,$4) RETURNING *",
        [nombre, apellido, email, mensaje]
    )

    res.status(201).json({success:true, data: result.rows[0]});
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al guardar el mensaje' });
    }
})

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.get('/mensajes', async (req, res) => {
    const auth = req.headers.authorization;
    const user = process.env.ADMIN_USER;
    const pass = process.env.ADMIN_PASS;

    if (!auth) {
        return res.status(401).send("No autorizado");
    }

    // auth = "Basic <base64>"
    const [scheme, encoded] = auth.split(' ');
    if (scheme !== 'Basic' || encoded !== Buffer.from(`${user}:${pass}`).toString('base64')) {
        return res.status(401).send("No autorizado");
    }

    try {
        const mensajes = await pool.query("SELECT * FROM mensajes ORDER BY fecha DESC");
        res.json(mensajes.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Error al obtener los mensajes' });
    }
});