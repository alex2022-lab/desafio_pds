const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')


const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type: {
        type: DataTypes.ENUM('general', 'VIP'),
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    available: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sold: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    event_id: { 
        type: DataTypes.INTEGER 
    },
    attendee_id: { 
        type: DataTypes.INTEGER 
    },
}, {
    tableName: 'tickets',
    timestamps: false
});

Ticket.associate = (models) => {
  Ticket.belongsTo(models.Event, { foreignKey: 'event_id', as: 'event' });
  Ticket.belongsTo(models.Attendee, { foreignKey: 'attendee_id', as: 'attendee' });
  Ticket.hasMany(models.Notification, { foreignKey: 'ticket_id', as: 'notifications' });
};



module.exports = Ticket;
