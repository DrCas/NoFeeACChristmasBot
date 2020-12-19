const Logger = require('../../util/Logger');
const TriviaQuestion = require('./TriviaQuestion');
const TriviaQuestions = require('./TriviaQuestions');

module.exports = {

    /**
     * Creates a new trivia question in the database and returns it as a TriviaQuestion
     * @param {String} question 
     * @param {String} image
     * @param {Array<String>} answers
     * @param {Integer} points 
     * @returns {TriviaQuestion}
     */
    async createNewTriviaQuestion(question, image, answers, correctAnswer, points = 5) {
        const createdQuestion = await TriviaQuestions.create({
            question: question,
            image: image,
            answerA: answers[0],
            answerB: answers[1],
            answerC: answers[2],
            answerD: answers[3],
            correctAnswer: correctAnswer,
            points: points
        }).catch(err => Logger.db_error(err));

        return new TriviaQuestion(createdQuestion.id, question, image, answers, correctAnswer, points, createdQuestion.correctAnswers, createdQuestion.wrongAnswers);
    },

    /**
     * Gets a question from the database
     * @param {Integer} questionID
     * @returns {TriviaQuestion}
     */
    async getQuestionByID(questionID) {
        const questionData = await TriviaQuestions.findOne({
            where: {
                id: questionID
            },
            raw: true
        }).catch(err => Logger.db_error(err));

        if (!questionData) {
            return null;
        }

        return new TriviaQuestion(questionData.id, questionData.question, questionData.image, [questionData.answerA, questionData.answerB, questionData.answerC, questionData.answerD], questionData.correctAnswer, questionData.points, questionData.correctAnswers, questionData.wrongAnswers);
    },

    /**
     * Returns all valid questionIDs
     * @returns {Array<Integer>}
     */
    async getListofIDs() {
        const questionData = await TriviaQuestions.findAll({
            attributes: ['id'],
            raw: true
        }).catch(err => Logger.db_error(err));

        let validIDs = new Array();

        for (let i = 0; i < questionData.length; i++) {
            validIDs.push(questionData[i].id);
        }

        return validIDs;
    },

    /**
     * Sets the amount of points you get from a question
     * @param {Integer} questionID 
     * @param {Integer} newPoints
     */
    async setPoints(questionID, newPoints) {
        await TriviaQuestions.update({
            points: newPoints
        }, {
            where: {
                id: questionID
            }
        }).catch(err => Logger.db_error(err));
    },

    /**
     * Adds +1 to the correctAnswers count of a question
     * @param {Integer} questionID
     */
    async addCorrectAnswer(questionID) {
        await TriviaQuestions.increment({
            correctAnswers: +1
        }, {
            where: {
                questionID: questionID
            }
        }).catch(err => Logger.db_error(err));
    },

    /**
     * Adds +1 to the wrongAnswers count of a question
     * @param {Integer} questionID
     */
    async addWrongAnswer(questionID) {
        await TriviaQuestions.increment({
            wrongAnswers: +1
        }, {
            where: {
                questionID: questionID
            }
        }).catch(err => Logger.db_error(err));
    }
}