const ChannelSettings = require("./ChannelSettings");
const Logger = require('../../util/Logger');
const ChannelSetting = require("./ChannelSetting");

module.exports = {

    async createChannelSettings(guildID, channelID, useForActivity = true) {
        await ChannelSettings.create({
            guildID: guildID,
            channelID: channelID,
            useForActivity: useForActivity,
            useForPopup: false
        }).catch(err => Logger.db_error(err));
    },

    /**
     * Turns on/off activity counting for a channel
     * @param {BigInt} guildID 
     * @param {BigInt} channelID
     * @param {Boolean} useForActivity 
     */
    async setActivityForChannel(guildID, channelID, useForActivity) {
        await ChannelSettings.update({
            useForActivity: useForActivity
        }, {
            where: {
                guildID: guildID,
                channelID: channelID
            }
        }).catch(err => Logger.db_error(err));
    },
    
    /**
     * Turns on/off popup messages for a channel
     * @param {BigInt} guildID 
     * @param {BigInt} channelID
     * @param {Boolean} useForPopup
     */
    async setPopupForChannel(guildID, channelID, useForPopup) {
        await ChannelSettings.update({
            useForPopup: useForPopup
        }, {
            where: {
                guildID: guildID,
                channelID: channelID
            }
        }).catch(err => Logger.db_error(err));
    },

    /**
     * Returns the ChannelSettings
     * @param {BigInt} guildID
     * @param {BigInt} channelID
     * @returns {ChannelSetting}
     */
    async getChannelByID(guildID, channelID) {
        const channelData = await ChannelSettings.findOne({
            where: {
                guildID: guildID,
                channelID: channelID
            },
            raw: true
        }).catch(err => Logger.db_error(err));

        if (!channelData) return null;
        return new ChannelSetting(channelData.guildID, channelData.channelID, channelData.useForActivity, channelData.useForPopup);
    },

    /**
     * Returns the channelID of where to show the popup for a guild
     * @param {BigInt} guildID 
     * @returns {BigInt} channelID
     */
    async getPopupChannelForGuild(guildID) {
        const channelData = await ChannelSettings.findOne({
            where: {
                guildID: guildID,
                useForPopup: true
            },
            raw: true
        }).catch(err => Logger.db_error(err));

        if (!channelData) return null;
        return channelData.channelID;
    },

    /**
     * Gets all channels with the specified useForActivity
     * @param {BigInt} guildID 
     * @param {Boolean} useForActivity 
     * @returns {ChannelSettings[]}
     */
    async getChannelInfoByAllowedActivity(guildID, useForActivity) {
        const channelData = await ChannelSettings.findAll({
            where: {
                guildID: guildID,
                useForActivity: useForActivity
            },
            raw: true
        }).catch(err => Logger.db_error(err));

        if (!channelData) return null;
        return channelData;
    }
}