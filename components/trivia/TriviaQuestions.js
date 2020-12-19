const Sequelize = require('sequelize');
const db = require('../../util/Database');

const TriviaQuestions = db.sequelize.define('trivia', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    question: {
        type: Sequelize.TEXT
    },
    image: {
        type: Sequelize.TEXT
    },
    answerA: {
        type: Sequelize.TEXT
    },
    answerB: {
        type: Sequelize.TEXT
    },
    answerC: {
        type: Sequelize.TEXT
    },
    answerD: {
        type: Sequelize.TEXT
    },
    correctAnswer: {
        type: Sequelize.INTEGER
    },
    points: {
        type: Sequelize.INTEGER
    },
    correctAnswers: {
        type: Sequelize.INTEGER
    },
    wrongAnswers: {
        type: Sequelize.INTEGER
    }
},
    {
        timestamps: false
    }
);

module.exports = TriviaQuestions;