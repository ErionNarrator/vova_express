const {Sequelize} = require('sequelize');

const sequelize = new Sequelize("expressdb", "postgres", "Root", {
    host: 'localhost',
    dialect: "postgres"
});

module.exports = sequelize;