class TriviaQuestion {

    /**
     * Creates a new TriviaQuestion instance
     * @param {Integer} id 
     * @param {String} question
     * @param {String} imageURL
     * @param {Array<String>} answers
     * @param {Integer} correctAnswer
     * @param {Integer} points
     * @param {Integer} correctAnswers
     * @param {Integer} wrongAnswers
     */
    constructor(id, question, imageURL, answers, correctAnswer, points, correctAnswers, wrongAnswers) {
        this.id = id;
        this.question = question;
        this.imageURL = imageURL;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
        this.points = points;
        this.correctAnswers = correctAnswers;
        this.wrongAnswers = wrongAnswers;
    }

    /**
     * Returns the Question ID
     */
    getID() {
        return this.id;
    }

    /**
     * Returns the Question
     */
    getQuestion() {
        return this.question;
    }

    /**
     * Returns the image URL
     */
    getImageURL() {
        return this.imageURL;
    }

    /**
     * Returns the array with answers
     */
    getAnswers() {
        return this.answers;
    }

    /**
     * Returns the correct answer number
     */
    getCorrectAnswer() {
        return this.correctAnswer;
    }

    /**
     * Returns the amount of points
     */
    getPoints() {
        return this.points;
    }

    /**
     * Returns the amount the question has been answered correctly
     */
    getCorrectAnswers() {
        return this.correctAnswers;
    }

    /**
     * Returns the amount the question has been answered incorectly
     */
    getWrongAnswers() {
        return this.wrongAnswers;
    }
}

module.exports = TriviaQuestion;