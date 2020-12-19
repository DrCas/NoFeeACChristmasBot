const { Permissions, Message, MessageEmbed } = require("discord.js");
const ChannelSettingsDAO = require("../../components/config/ChannelSettingsDAO");
const config = require("../../config");
const MessageHandler = require("../../util/MessageHandler");

module.exports = {
    name: 'config',
    userPermissions: ['MANAGE_GUILD'],
    botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    /**
     * @param {Message} message 
     * @param {*} args 
     */
    async execute(message, args) {
        if (!message.guild) return message.channel.send('This command does not work in DMs');
        if (!args[0]) return message.channel.send('Missing arguments! Should be either `channel`, `system`, `force` or `reset`');

        switch (args[0]) {
            case 'reset':
                message.client.activity.resetActivity(message.guild.id);
                return message.channel.send('Success! Activity has been reset');
            case 'force':
                MessageHandler.questionGenerator(message);
                return message.channel.send('Success! A new question has been sent.');
            case 'system':
                const embed = new MessageEmbed()
                    .setColor('RED')
                    .setTimestamp(Date.now())
                    .setTitle('Chance Configurations')
                    .setDescription(`*Note: Can only be changed in the config file. These values are final.*\n**Message Value Modifier:** ${config.game.modifier}\n**Random Question Popup Chance:** ${config.game.popupChance * 100}%\n**Random Grinch Chance:** ${config.game.grinchPopupChance * 100}%\n**Answer Time:** ${config.game.answerTime} seconds`);

                return message.channel.send(embed);
            case 'channel':
                if (!args[1]) return message.channel.send('Missing arguments! Please tag a channel.')
                this.channelConfigHandler(message, args);
                break;
        }
    },

    /**
    * @param {Message} message
    * @param {*} args
    */
    async channelConfigHandler(message, args) {
        let channel = null;
        try {
            channel = await message.mentions.channels.first();
        } catch (err) {
            return message.channel.send('Invalid argument! Please tag a channel.');
        }

        if (!args[2]) {
            const channelSettings = await ChannelSettingsDAO.getChannelByID(message.guild.id, channel.id);

            const embed = new MessageEmbed()
                .setColor('RED')
                .setTimestamp(Date.now())
                .setTitle('Channel Settings')
                .setDescription(`Name: ${channel.name}\nUse for activity: ${channelSettings.useActivity ? 'Yes' : 'No'}\nUse for popups: ${channelSettings.usePopup ? 'Yes' : 'No'}`);

            return message.channel.send(embed);
        } else {
            switch (args[2]) {
                case 'activity':
                    if (!args[3] || (args[3] !== 'true' && args[3] !== 'false')) return message.channel.send('Missing argument! Should be either `true` or `false`');
                    let activity = false;
                    if (args[3] === 'true') activity = true;
                    ChannelSettingsDAO.setActivityForChannel(message.guild.id, channel.id, activity);
                    return message.channel.send(`Success! Activity monitoring for <#${channel.id}> is now ${activity ? 'enabled' : 'disabled'}`);
                case 'popup':
                    if (!args[3] || (args[3] !== 'true' && args[3] !== 'false')) return message.channel.send('Missing argument! Should be either `true` or `false`');
                    let popup = false;
                    if (args[3] === 'true') popup = true;

                    if (popup) {
                        const popupChannel = await ChannelSettingsDAO.getPopupChannelForGuild(message.guild.id);
                        if (!popupChannel) {
                            ChannelSettingsDAO.setPopupForChannel(message.guild.id, channel.id, true);
                            return message.channel.send(`Success! <#${channel.id}> will now get question popups.`);
                        } else {
                            ChannelSettingsDAO.setPopupForChannel(message.guild.id, popupChannel, false);
                            ChannelSettingsDAO.setPopupForChannel(message.guild.id, channel.id, true);
                            return message.channel.send(`Another channel was already configured for popups (<#${popupChannel}>), it has been replaced with <#${channel.id}>`)
                        }
                    } else {
                        ChannelSettingsDAO.setPopupForChannel(message.guild.id, channel.id, false);
                    }
                    return message.channel.send(`Success! <#${channel.id}> will not have question popups anymore.`);
                default:
                    return message.channel.send('Invalid argument! Should be either `activity` or `popup`')
            }
        }
    }
};