const express = require('express');
const router = express.Router();
const Event = require('../models/Event');


router.post('/', async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


router.get('/', async (req, res) => {
  const events = await Event.findAll();
  res.json(events);
});


router.get('/:id', async (req, res) => {
  const event = await Event.findByPk(req.params.id);
  event ? res.json(event) : res.status(404).json({ error: 'Evento no encontrado' });
});


router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Event.update(req.body, { where: { id: req.params.id } });
    updated ? res.json(await Event.findByPk(req.params.id)) : res.status(404).json({ error: 'Evento no encontrado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  const deleted = await Event.destroy({ where: { id: req.params.id } });
  deleted ? res.json({ message: 'Evento eliminado' }) : res.status(404).json({ error: 'Evento no encontrado' });
});


module.exports = router;
