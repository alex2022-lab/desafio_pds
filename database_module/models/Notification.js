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
    }
}, {
    tableName: 'notifications',
    timestamps: false
});


module.exports = Notification;