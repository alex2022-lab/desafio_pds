const express = require('express');
const sequelize = require('./config/database');


const eventRoutes = require('./routes/events');
const attendeeRoutes = require('./routes/attendees');
const ticketRoutes = require('./routes/tickets');
const notificationRoutes = require('./routes/notifications');


const app = express();
app.use(express.json());


app.use('/events', eventRoutes);
app.use('/attendees', attendeeRoutes);
app.use('/tickets', ticketRoutes);
app.use('/notifications', notificationRoutes);


sequelize.sync()
  .then(() => console.log('✅ Todas las tablas creadas/verificadas'))
  .catch(err => console.error('❌ Error al sincronizar:', err));


app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));