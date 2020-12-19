const ChannelSettingsDAO = require("../config/ChannelSettingsDAO");

class ChannelSettingsCache {

    allowedChannels = new Map();
    disallowedChannels = new Map();

    constructor() {
    }

    /**
     * Checks if a channel is allowed or disallowed for activity
     * @param {BigInt} guildID 
     * @param {BigInt} channelID 
     * @returns {Boolean}
     */
    async checkChannel(guildID, channelID, repeat = false) {
        if (this.allowedChannels.has(guildID) && this.disallowedChannels.has(guildID)) {
            if (this.getAllowedChannels(guildID).includes(channelID)) {
                return true;
            } else if (this.getDisallowedChannels(guildID).includes(channelID)) {
                return false;
            } else {
                if (repeat) await ChannelSettingsDAO.createChannelSettings(guildID, channelID);
                await this.populateCache(guildID);
                return await this.checkChannel(guildID, channelID, true);
            }
        } else {
            if (repeat) await ChannelSettingsDAO.createChannelSettings(guildID, channelID);
            await this.populateCache(guildID);
            return await this.checkChannel(guildID, channelID, true);
        }
    }

    async populateCache(guildID) {
        const allowedChannelIDs = await ChannelSettingsDAO.getChannelInfoByAllowedActivity(guildID, true);
        if(allowedChannelIDs.length == 0) this.getAllowedChannels(guildID);
        for (let i = 0; i < allowedChannelIDs.length; i++) {
            this.getAllowedChannels(guildID).push(allowedChannelIDs[i].channelID);
        }

        const disallowedChannelIDs = await ChannelSettingsDAO.getChannelInfoByAllowedActivity(guildID, false);
        if (disallowedChannelIDs.length == 0) this.getDisallowedChannels(guildID);
        for (let i = 0; i < disallowedChannelIDs.length; i++) {
            this.getDisallowedChannels(guildID).push(disallowedChannelIDs[i].channelID);
        }
    }

    /**
     * @returns {Array<BigInt>}
     */
    getAllowedChannels(guildID) {
        if (this.allowedChannels.has(guildID)) {
            return this.allowedChannels.get(guildID);
        } else {
            this.allowedChannels.set(guildID, new Array())
            return this.getAllowedChannels(guildID);
        }
    }

    /**
     * @returns {Array<BigInt>}
     */
    getDisallowedChannels(guildID) {
        if(this.disallowedChannels.has(guildID)) {
            return this.disallowedChannels.get(guildID);
        } else {
            this.disallowedChannels.set(guildID, new Array());
            return this.getDisallowedChannels(guildID);
        }
    }

}

module.exports = ChannelSettingsCache;