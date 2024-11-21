const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Para manejar CORS

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Permitir solicitudes de cualquier origen
    methods: ["GET", "POST"]
  }
});

// Middlewares
app.use(cors());
app.use(express.json()); // Para procesar JSON

let pedidos = [];

// Ruta para recibir pedidos
app.post('/api/pedido', (req, res) => {
  const pedido = req.body;
  if (!pedido.mesa || !pedido.producto || !pedido.cantidad || !pedido.area) {
    return res.status(400).send('Faltan datos en el pedido.');
  }

  pedidos.push(pedido);

  // Emitir el pedido a la sala correspondiente (área)
  io.to(pedido.area).emit('nuevoPedido', pedido);

  console.log('Nuevo pedido recibido:', pedido);
  res.status(200).send('Pedido recibido');
});

// Ruta para verificar los pedidos almacenados (para debugging)
app.get('/api/pedidos', (req, res) => {
  res.json(pedidos);
});

// Manejo de conexiones de Socket.IO
io.on('connection', (socket) => {
  console.log('Nueva conexión de cliente');

  // Unir a una sala específica
  socket.on('unirArea', (area) => {
    socket.join(area);
    console.log(`Cliente unido al área: ${area}`);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Inicia el servidor
const PORT = 4000;
server.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:4000');
});
