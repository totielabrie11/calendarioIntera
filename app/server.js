const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();

const PORT = 3000;

app.use(express.json());

const dbFile = 'db.json';

app.use(cors());

let nextId = 1; // Mover la declaración de nextId aquí

// Verificar si el archivo db.json existe, si no, crearlo
if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, '[]', 'utf8');
} else {
  // Leer el contenido actual del archivo db.json al iniciar la aplicación
  const events = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
  if (events.length > 0) {
    // Obtener el último ID y establecer nextId en el siguiente valor
    const lastId = events[events.length - 1].id;
    nextId = lastId + 1;
  }
}

app.use(express.static(path.join(__dirname, '../cliente')));

app.post('/events', (req, res) => {
  // Obtener el nuevo usuario del cuerpo de la solicitud
  const nuevoUsuario = req.body;
  nuevoUsuario.id = nextId++;

  // Leer el contenido actual del archivo db.json
  fs.readFile(dbFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al leer la base de datos.' });
    }

    let events = [];

    try {
      // Parsear el contenido actual del archivo a un array
      events = JSON.parse(data);
    } catch (parseError) {
      console.error(parseError);
      return res.status(500).json({ error: 'Error al parsear la base de datos.' });
    }

    // Agregar el nuevo usuario al array
    events.push(nuevoUsuario);

    // Convertir el array actualizado a JSON
    const eventsJSON = JSON.stringify(events, null, 2);

    // Escribir el JSON en el archivo db.json
    fs.writeFile(dbFile, eventsJSON, (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
        return res.status(500).json({ error: 'Error al escribir en la base de datos.' });
      }

      // Responder con el nuevo usuario agregado
      res.json(nuevoUsuario);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
