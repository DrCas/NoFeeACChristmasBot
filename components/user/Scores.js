const Sequelize = require('sequelize');
const db = require('../../util/Database');

const Scores = db.sequelize.define('scores', {
    userID: {
        type: Sequelize.BIGINT,
        primaryKey: true
    },
    guildID: {
        type: Sequelize.BIGINT,
        primaryKey: true
    },
    points: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false
});

module.exports = Scores;