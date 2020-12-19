const { MessageEmbed, Message } = require("discord.js");
const moment = require("moment");
const TriviaQuestion = require('../components/trivia/TriviaQuestion');
const answerLetters = ['🇦', '🇧', '🇨', '🇩'];

module.exports = {

    /**
     * Creates a MessageEmbed for a question
     * @param {TriviaQuestion} question 
     * @param {Date} answerDate
     * @returns {MessageEmbed}
     */
    createQuestionEmbed(question, answerDate) {
        const embedBase = new MessageEmbed()
            .setColor('DARK_BLUE')
            .setTitle(question.getQuestion());

        let description = `${answerLetters[0]}: ${question.getAnswers()[0]}\n${answerLetters[1]}: ${question.getAnswers()[1]}`;
        if (question.getAnswers()[2]) description += `\n${answerLetters[2]}: ${question.getAnswers()[2]}`;
        if (question.getAnswers()[3]) description += `\n${answerLetters[3]}: ${question.getAnswers()[3]}`;
        embedBase.setDescription(description);

        if (question.getImageURL()) embedBase.setImage(question.getImageURL());

        const timeRemainingSeconds = moment(answerDate).diff(moment(Date.now()), 'seconds');
        embedBase.addField(`Time Remaining`, `${timeRemainingSeconds} seconds`);

        if (timeRemainingSeconds < 5) embedBase.setColor('ORANGE');

        return embedBase;
    },

    /**
     * Adds all reactions to a question
     * @param {Message} message 
     * @param {TriviaQuestion} question 
     */
    async createQuestionReactions(message, question) {
        message.react('🇦');
        message.react('🇧');

        if (question.getAnswers()[2]) message.react('🇨');
        if (question.getAnswers()[3]) message.react('🇩');
    },

    /**
     * Creates a MessageEmbed for a closed question
     * @param {TriviaQuestion} question
     */
    createClosedQuestionEmbed(question) {
        const embedBase = new MessageEmbed()
            .setTitle(question.getQuestion())
            .setDescription(`Correct answer: ${answerLetters[question.getCorrectAnswer()]} ${question.getAnswers()[question.getCorrectAnswer()]}`);

        // let description = `Correct answer: ${answerLetters[question.getCorrectAnswer()]}`;
        // description += this.checkAnswerForCorrectAnswer(question, 0);
        // description += this.checkAnswerForCorrectAnswer(question, 1);
        // description += this.checkAnswerForCorrectAnswer(question, 2);
        // description += this.checkAnswerForCorrectAnswer(question, 3);

        if (question.getImageURL()) embedBase.setImage(question.getImageURL());
        embedBase.addField(`Time Remaining`, `Time's up!`);

        return embedBase;
    },

    /**
     * Bolds answer if its correct, otherwise not
     * @param {TriviaQuestion} question 
     * @param {Integer} answerNumber 
     * @returns {String}
     */
    checkAnswerForCorrectAnswer(question, answerNumber) {
        if (question.getAnswers()[answerNumber]) {
            if (question.getCorrectAnswer() == answerNumber) {
                return `\n**${answerLetters[answerNumber]}: ${question.getAnswers()[answerNumber]}**`;
            } else {
                return `\n${answerLetters[answerNumber]}: ${question.getAnswers()[answerNumber]}`;
            }
        }
        return '';
    }
}