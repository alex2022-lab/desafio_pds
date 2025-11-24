const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')


const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'events',
    timestamps: false
});

Event.associate = (models) => {
  Event.hasMany(models.Ticket, { foreignKey: 'event_id', as: 'tickets' });
  Event.hasMany(models.Notification, { foreignKey: 'event_id', as: 'notifications' });
};


module.exports = Event;