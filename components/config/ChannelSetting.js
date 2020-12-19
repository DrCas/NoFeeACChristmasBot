class ChannelSetting {

    /**
     * Create a new ChannelSetting instance
     * @param {BigInt} guildID
     * @param {BigInt} channelID
     * @param {Boolean} useForActivity 
     * @param {Boolean} useForPopup 
     */
    constructor(guildID, channelID, useForActivity, useForPopup) {
        this.guildID = guildID;
        this.channelID = channelID;
        this.useForActivity = useForActivity;
        this.useForPopup = useForPopup;
    }

    /**
     * Returns the guildID of the ChannelSetting
     */
    getGuildID() {
        return this.guildID;
    }

    /**
     * Returns the channelID of the ChannelSetting
     */
    getChannelID() {
        return this.channelID;
    }

    /**
     * Returns whether the channel is used for activity
     */
    useActivity() {
        return this.useForActivity;
    }

    /**
     * Returns whether the channel is used for popups
     */
    usePopup() {
        return this.useForPopup;
    }
}

module.exports = ChannelSetting;