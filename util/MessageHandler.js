const { Message, User, TextChannel, MessageEmbed } = require("discord.js");
const ChannelSettingsDAO = require("../components/config/ChannelSettingsDAO");
const TriviaQuestion = require("../components/trivia/TriviaQuestion");
const TriviaQuestionDAO = require("../components/trivia/TriviaQuestionDAO");
const Activity = require("../components/activity/Activity");
const ScoreDAO = require("../components/user/ScoreDAO");
const config = require("../config");
const QuestionCreator = require("./QuestionCreator");
const answerLetters = ['🇦', '🇧', '🇨', '🇩'];

module.exports = {

    /**
     * Calculate activity with new message and checks if a new trivia question should be sent
     * @param {Activity} activity
     * @param {Message} message 
     */
    async messageHandler(activity, message) {
        if(message.author.bot) return;
        if (!await activity.getChannelSettingsCache().checkChannel(message.guild.id, message.channel.id)) return;

        //random value 0 - 1.0 * 0.1 allows us to get a value between 0 and 10 if the message length is 100, which is the average
        const messageLengthValue = Math.random() * message.content.length * 0.1;
        const minimumOneValue = Math.max(1, messageLengthValue);
        const limitToTen = Math.min(10, minimumOneValue);
        const activityValue = config.game.modifier * limitToTen;

        activity.addActivity(message.guild.id, activityValue);

        let bool1 = activity.isOverMinimums(message.guild.id);
        let bool2 = config.game.popupChance >= Math.random();

        if (bool1 && bool2) {
            await this.questionGenerator(message);
            activity.resetActivity(message.guild.id);
        }
    },

    /**
     * Generates a random question, sends it to the specified popup channel and calculates scores.
     * @param {Message} message 
     * @returns {Message} Message object of the question sent
     */
    async questionGenerator(message) {
        const triviaIDs = await TriviaQuestionDAO.getListofIDs();
        const randomQuestionID = triviaIDs[Math.floor(Math.random() * triviaIDs.length)];

        const randomQuestion = await TriviaQuestionDAO.getQuestionByID(randomQuestionID);
        const endDate = new Date(Date.now() + config.game.answerTime * 1000);
        const messageEmbed = QuestionCreator.createQuestionEmbed(randomQuestion, endDate);

        const channel = await message.guild.channels.resolve(await ChannelSettingsDAO.getPopupChannelForGuild(message.guild.id));
        const questionMessage = await channel.send(messageEmbed);
        await QuestionCreator.createQuestionReactions(questionMessage, randomQuestion);

        const updateInterval = setInterval(() => this.updateMessageTime(questionMessage, randomQuestion, endDate), (randomQuestion.getImageURL() == null ? 3000 : 5000));
        setTimeout(() => clearInterval(updateInterval), (config.game.answerTime + 1) * 1000)
        setTimeout(() => this.fetchAnswers(questionMessage, randomQuestion), (config.game.answerTime + 1) * 1000);

        return questionMessage;
    },

    /**
     * Updates the Question with the time remaining
     * @param {Message} message 
     * @param {TriviaQuestion} question
     * @param {Date} endDate 
     */
    async updateMessageTime(message, question, endDate) {
        if (endDate < Date.now()) return;

        message.edit(QuestionCreator.createQuestionEmbed(question, endDate));
    },

    /**
     * Fetches user answers and gives/subtracts points where needed.
     * @param {Message} message
     * @param {TriviaQuestion} question
     */
    async fetchAnswers(message, question) {
        const embed = QuestionCreator.createClosedQuestionEmbed(question);
        await message.edit(embed);

        const userListRaw = [await this.getReactedUsers(message, 0),
        await this.getReactedUsers(message, 1),
        await this.getReactedUsers(message, 2),
        await this.getReactedUsers(message, 3)];

        const userList = this.weedOutDoubleAnswers(userListRaw);

        const correctAnswers = userList[question.getCorrectAnswer()].length;
        const incorrectAnswers = (userList[0].length + userList[1].length + userList[2].length + userList[3].length) - correctAnswers;
        const answerRatio = incorrectAnswers / correctAnswers;

        if (correctAnswers + incorrectAnswers == 1) {
            embed.addField('No one wants to play \:(', `I'm sorry...`);
            message.edit(embed);
            message.reactions.removeAll();
            return;
        }

        let points = question.getPoints();
        if (answerRatio > 2) points *= 2;

        const correctAnswerUsers = new Array();

        for (let i = 0; i < correctAnswers; i++) {
            if (!userList[question.getCorrectAnswer()][i].bot) {
                await ScoreDAO.updatePoints(userList[question.getCorrectAnswer()][i].id, message.guild.id, points);
                correctAnswerUsers.push(userList[question.getCorrectAnswer()][i].username);
            }
        }

        let subtractPoints = 5; //do not change
        if (config.game.grinchPopupChance > Math.random()) subtractPoints *= 2;

        const wrongAnswerUsers = new Array();

        for (let i = 0; i < 4; i++) {
            if (question.getCorrectAnswer() != i && question.answers[i] != null) {
                await this.subtractPoints(userList[i], message.guild.id, subtractPoints);

                for (let j = 0; j < userList[i].length; j++) {
                    if (!userList[i][j].bot) wrongAnswerUsers.push(userList[i][j].username);
                }
            }
        }

        if (subtractPoints > 5) {
            embed.addField(`Oh no!`, `The grinch showed up and took extra points for incorrect answers!`);
        }

        if (answerRatio > 2) {
            embed.addField(`Hard Question Bonus!`, `Double points for correct answers!`);
        }

        message.edit(embed);
        message.reactions.removeAll();

        this.sendResponsesEmbed(message.channel, points, subtractPoints, correctAnswerUsers, wrongAnswerUsers);
    },

    /**
     * Sends a list of who voted for what option and deletes it
     * @param {TextChannel} channel 
     * @param {Integer} correctPoints
     * @param {Integer} incorrectPoints
     * @param {Array} correctAnswerUsers
     * @param {Array} wrongAnswerUsers
     */
    async sendResponsesEmbed(channel, correctPoints, incorrectPoints, correctAnswerUsers, wrongAnswerUsers) {
        const embed = new MessageEmbed()
            .setColor('GRAY')
            .setTimestamp(Date.now())
            .setTitle('Results')

        if (correctAnswerUsers.length != 0) {
            let userListDesc = `**+${correctPoints} points**`;
            correctAnswerUsers.forEach(username => {
                userListDesc += `\n${username}`
            });

            embed.addField('Correct Answers', userListDesc, true);
        }
        
        if (wrongAnswerUsers.length != 0) {
            let userListDesc = `**-${incorrectPoints} points**`;
            wrongAnswerUsers.forEach(username => {
                userListDesc += `\n${username}`
            });

            embed.addField('Incorrect Answers', userListDesc, true);
        }

        const message = await channel.send(embed);

        setTimeout(() => message.delete(), 30000);
    },

    /**
     * Removes any double answers
     * @param {User[][]} userList 
     * @returns {User[][]}
     */
    weedOutDoubleAnswers(userList) {
        const presentIDsArray = new Array();
        const newUserList = new Array();

        for (let i = 0; i < userList.length; i++) {
            if (userList[i] != null) {
                const newList = new Array();

                for (let j = 0; j < userList[i].length; j++) {
                    if (!presentIDsArray.includes(userList[i][j].id)) {
                        newList.push(userList[i][j]);
                        presentIDsArray.push(userList[i][j].id);
                    }
                }

                newUserList.push(newList);
            } else {
                newUserList.push(null);
            }
        }

        return newUserList;
    },

    /**
     * Calculate points for every answer
     * @param {Message} message
     * @param {TriviaQuestion} question
     * @param {Integer} answerNumber 
     * @returns {Array}
     */
    async getReactedUsers(message, answerNumber) {
        try {
            const reactions = await message.reactions.resolve(answerLetters[answerNumber]);
            await reactions.users.fetch()

            return await reactions.users.cache.array();
        } catch (err) {
            return new Array(0);
        }
    },

    /**
     * Subtracts some points from a user
     * @param {User[]} userList 
     * @param {BigInt} guildID
     * @param {Integer} points
     */
    async subtractPoints(userList, guildID, points) {
        for (let i = 0; i < userList.length; i++) {
            if (!userList[i].bot) {
                await ScoreDAO.updatePoints(userList[i].id, guildID, -points);
            }
        }
    }
}