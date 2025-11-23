const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');


router.post('/', async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/', async (req, res) => {
  const tickets = await Ticket.findAll();
  res.json(tickets);
});


router.get('/:id', async (req, res) => {
  const ticket = await Ticket.findByPk(req.params.id);
  ticket ? res.json(ticket) : res.status(404).json({ error: 'Entrada no encontrada' });
});


router.put('/:id', async (req, res) => {
  const [updated] = await Ticket.update(req.body, { where: { id: req.params.id } });
  updated ? res.json(await Ticket.findByPk(req.params.id)) : res.status(404).json({ error: 'Entrada no encontrada' });
});


router.delete('/:id', async (req, res) => {
  const deleted = await Ticket.destroy({ where: { id: req.params.id } });
  deleted ? res.json({ message: 'Entrada eliminada' }) : res.status(404).json({ error: 'Entrada no encontrada' });
});

module.exports = router;