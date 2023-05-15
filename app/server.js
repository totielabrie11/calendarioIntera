const express = require('express');
const cors = require('cors');
const fs = require('fs');

// Habilitar CORS

const app = express();
app.use(express.json());
app.use(cors());

// Verificar si el archivo db.json existe, de lo contrario, crearlo
if (!fs.existsSync('db.json')) {
  fs.writeFileSync('db.json', JSON.stringify({ events: [] }), 'utf8');
}

// Leer el contenido del archivo db.json al iniciar el servidor
const dbData = fs.readFileSync('db.json', 'utf8');
const { events } = JSON.parse(dbData);

// Ruta para obtener todos los eventos
app.get('/events', (req, res) => {
  res.json(events);
});

// Ruta para crear o actualizar eventos en el archivo db.json
app.post('/events', (req, res) => {
  const eventData = req.body;

  events.push(eventData);

  // Guardar el array de eventos en el archivo db.json
  fs.writeFile('db.json', JSON.stringify({ events }), 'utf8', err => {
    if (err) {
      console.error('Error al guardar el evento:', err);
      res.status(500).json({ error: 'Error al guardar el evento' });
    } else {
      console.log('Evento guardado correctamente');
      res.sendStatus(200);
    }
  });
});

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
