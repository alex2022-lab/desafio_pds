const express = require('express');
const router = express.Router();
const Attendee = require('../models/Attendee');


router.post('/', async (req, res) => {
  try {
    const attendee = await Attendee.create(req.body);
    res.status(201).json(attendee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/', async (req, res) => {
  const attendees = await Attendee.findAll();
  res.json(attendees);
});


router.get('/:id', async (req, res) => {
  const attendee = await Attendee.findByPk(req.params.id);
  attendee ? res.json(attendee) : res.status(404).json({ error: 'Asistente no encontrado' });
});


router.put('/:id', async (req, res) => {
  const [updated] = await Attendee.update(req.body, { where: { id: req.params.id } });
  updated ? res.json(await Attendee.findByPk(req.params.id)) : res.status(404).json({ error: 'Asistente no encontrado' });
});


router.delete('/:id', async (req, res) => {
  const deleted = await Attendee.destroy({ where: { id: req.params.id } });
  deleted ? res.json({ message: 'Asistente eliminado' }) : res.status(404).json({ error: 'Asistente no encontrado' });
});


module.exports = router;