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
    }
}, {
    tableName: 'tickets',
    timestamps: false
});


module.exports = Ticket;
