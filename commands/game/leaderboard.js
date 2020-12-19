const { Message, MessageEmbed } = require("discord.js");
const ScoreDAO = require("../../components/user/ScoreDAO");

module.exports = {
    name: 'leaderboard',
    userPermissions: [],
    botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    /**
     * 
     * @param {Message} message 
     * @param {*} args 
     */
    async execute(message, args) {

        if(!message.guild) return message.channel.send('This command cannot be run in DMs!');

        let description = '';
        const scoreList = await ScoreDAO.getTopScores(message.guild.id, 10, 0);

        for (let i = 0; i < scoreList.length; i++) {
            switch (i) {
                case 0:
                    description += `**Champion: **\n`;
                    break;
                case 1:
                    description += `\n**Runner Up: **\n`;
                    break;
                    case 2:
                        description += `\n`;
                default:
                    description += `${i + 1}. `
                    break;

            }
            description += `${(await message.client.users.fetch(scoreList[i].getUserID())).username}: ${scoreList[i].getPoints()}\n`;
        }


        const embed = new MessageEmbed()
            .setColor('ORANGE')
            .setTimestamp(Date.now())
            .setTitle('Leaderboard')
            .setDescription(description);

        return message.channel.send(embed);

    },
};