const ChannelSettingsCache = require("./ChannelSettingsCache");

class Activity {

    minimums = new Map();
    lastTimestamp = new Map();
    current = new Map();
    channelSettingsCache = new ChannelSettingsCache();

    constructor() {
    }

    /**
     * Get the minimum activity for the bot to trigger
     * @param {*} guildID 
     */
    getActivityMinimum(guildID) {
        if (this.minimums.has(guildID)) {
            return this.minimums.get(guildID);
        } else {
            this.minimums.set(guildID, Math.max(2, Math.random() * 10)); //TODO CHANGE TO ACTUAL VALUE
            return this.getActivityMinimum(guildID);
        }
    }

    /**
     * Adds activity to a guild
     * @param {*} guildID 
     * @param {*} activity 
     */
    addActivity(guildID, activity) {
        if (this.current.has(guildID)) {
            this.current.set(guildID, this.current.get(guildID) + activity);
        } else {
            this.current.set(guildID, activity);
        }
    }

    /**
     * Gets current guild activity
     * @param {*} guildID
     * @returns {Integer}
     */
    getActivity(guildID) {
        return this.current.get(guildID);
    }

    /**
    * Checks if current activity is over minimums
    * @param {*} guildID
    * @returns {Boolean}
    */
    isOverMinimums(guildID) {
        return (this.current.get(guildID) > this.getActivityMinimum(guildID));
    }

    /**
     * Resets a guilds' activity
     */
    resetActivity(guildID) {
        this.current.delete(guildID);
        this.minimums.delete(guildID);
    }

    /**
     * Returns the ChannelSettingsCache
     * @returns {ChannelSettingsCache}
     */
    getChannelSettingsCache() {
        return this.channelSettingsCache;
    }
}

module.exports = Activity;