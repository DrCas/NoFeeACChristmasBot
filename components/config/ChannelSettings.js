const Sequelize = require('sequelize');
const db = require('../../util/Database');

const ChannelSettings = db.sequelize.define('channelSettings', {
    guildID: {
        type: Sequelize.BIGINT,
        primaryKey: true
    },
    channelID: {
        type: Sequelize.BIGINT,
        primaryKey: true
    },
    useForActivity: {
        type: Sequelize.BOOLEAN
    },
    useForPopup: {
        type: Sequelize.BOOLEAN
    }
},
    {
        timestamps: false
    }
);

module.exports = ChannelSettings;