const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Event = require('./Event')(sequelize, Sequelize.DataTypes);
const Ticket = require('./Ticket')(sequelize, Sequelize.DataTypes);
const Attendee = require('./Attendee')(sequelize, Sequelize.DataTypes);

Event.associate({ Ticket });
Ticket.associate({ Event, Attendee });
Attendee.associate({ Ticket });

module.exports = {
  sequelize,
  Event,
  Ticket,
  Attendee
};
