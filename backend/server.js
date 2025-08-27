import express from 'express';
import cors from 'cors';
import { openDb } from './database.js';
import dotenv from 'dotenv';

dotenv.config();

let db; // referencia global

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ["https://jordimarti.netlify.app"]
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
    if (!db) return res.status(503).json({ ok: false, error: 'BD no inicializada aún' });
        const { nombre, apellido, email, mensaje } = req.body;

        await db.run(
            'INSERT INTO mensajes (nombre, apellido, email, mensaje) VALUES (?, ?, ?, ?)',
            [nombre, apellido, email, mensaje]
        );

        console.log("formulario recibido");
        res.json({ ok: true });
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

    if (!auth || auth !== `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`) {
        return res.status(401).send("No autorizado");
    }

    try {
        const mensajes = await db.all('SELECT * FROM mensajes');
        res.json(mensajes);
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al obtener los mensajes' });
    }
})