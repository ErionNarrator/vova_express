const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');


module.exports = sequelize;
const User = sequelize.define("user", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
});

module.exports = User;