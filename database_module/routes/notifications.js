const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');


router.post('/', async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/', async (req, res) => {
  const notifications = await Notification.findAll();
  res.json(notifications);
});


router.get('/:id', async (req, res) => {
  const notification = await Notification.findByPk(req.params.id);
  notification ? res.json(notification) : res.status(404).json({ error: 'Notificación no encontrada' });
});


router.put('/:id', async (req, res) => {
  const [updated] = await Notification.update(req.body, { where: { id: req.params.id } });
  updated ? res.json(await Notification.findByPk(req.params.id)) : res.status(404).json({ error: 'Notificación no encontrada' });
});


router.delete('/:id', async (req, res) => {
  const deleted = await Notification.destroy({ where: { id: req.params.id } });
  deleted ? res.json({ message: 'Notificación eliminada' }) : res.status(404).json({ error: 'Notificación no encontrada' });
});


module.exports = router;