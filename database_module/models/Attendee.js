const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')


const Attendee = sequelize.define('Attendee', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('confirmado', 'no_confirmado'),
        defaultValue: 'no_confirmado'
    }
}, {
    tableName: 'attendees',
    timestamps: false
});

Attendee.associate = (models) => {
  // Un asistente puede tener muchos tickets
  Attendee.hasMany(models.Ticket, { foreignKey: 'attendee_id', as: 'tickets' });

  // Un asistente puede recibir muchas notificaciones
  Attendee.hasMany(models.Notification, { foreignKey: 'attendee_id', as: 'notifications' });
};


module.exports = Attendee;