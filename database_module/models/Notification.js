const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')


const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type: {
        type: DataTypes.ENUM('correo', 'SMS'),
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sent_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    recipients: {
        type: DataTypes.STRING
    },
    attendee_id: { 
        type: DataTypes.INTEGER 
    },   
    event_id: { 
        type: DataTypes.INTEGER 
    },      
    ticket_id: { 
        type: DataTypes.INTEGER 
    },
}, {
    tableName: 'notifications',
    timestamps: false
});

Notification.associate = (models) => {
    Notification.belongsTo(models.Attendee, {
        foreignKey: 'attendee_id',
        as: 'attendee'
    });

    Notification.belongsTo(models.Event, {
        foreignKey: 'event_id',
        as: 'event'
    });

    Notification.belongsTo(models.Ticket, {
        foreignKey: 'ticket_id',
        as: 'ticket'
    });
};

module.exports = Notification;