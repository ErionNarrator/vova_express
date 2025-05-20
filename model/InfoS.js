const {DataTable, DataTypes} = require('sequelize');
const sequelize = require('../db/databese');

module.exports = sequelize;
const InfoS = sequelize.define('infoS', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },


})

module.exports = InfoS;