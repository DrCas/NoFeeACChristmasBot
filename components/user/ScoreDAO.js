const Logger = require('../../util/Logger');
const Scores = require('./Scores');
const Score = require('./Score');
const { Op } = require('sequelize');

module.exports = {
    /**
     * Gets a score from the database
     * @param {BigInt} userID 
     * @param {BigInt} guildID
     * @returns {Score}
     */
    async getScoreData(userID, guildID) {
        const scoreData = await Scores.findOne({
            where: {
                userID: userID,
                guildID: guildID
            },
            raw: true
        }).catch(err => Logger.db_error(err));

        if (!scoreData) {
            return await this.createNewScore(userID, guildID);
        }
        return new Score(scoreData.userID, scoreData.guildID, scoreData.points);
    },
    
    /**
     * Gets the top scores
     * @param {BigInt} guildID 
     * @param {Integer} numberOfRecords 
     * @param {Integer} start 
     * @returns {Array<Score>}
     */
    async getTopScores(guildID, numberOfRecords, start = 0) {
        const scoreData = await Scores.findAll({
            where: {
                guildID: guildID
            },
            order: [['points', 'DESC']],
            limit: numberOfRecords,
            offset: start
        }).catch(err => Logger.db_error(err));

        const scoreList = new Array();

        for (let i = 0; i < scoreData.length; i++) {
            scoreList.push(new Score(scoreData[i].userID, scoreData[i].guildID, scoreData[i].points));
        }

        return scoreList;
    },

    /**
     * Returns position in leaderboard
     * @param {BigInt} guildID 
     * @param {BigInt} userID 
     */
    async getScorePosition(guildID, userID) {
        const userScore = await this.getScoreData(userID, guildID);

        const scoreData = await Scores.findAll({
            where: {
                guildID: guildID,
                points: {
                    [Op.gte]: userScore.getPoints()
                }
            },
            order: [['points', 'DESC']]
        }).catch(err => Logger.db_error(err));

        if(!scoreData) return 0;
        return scoreData.length;
    },

    /**
     * Creates a new score in the database and returns a new Score.
     * @param {BigInt} userID 
     * @returns {Score}
     */
    async createNewScore(userID, guildID) {
        await Scores.create({
            userID: userID,
            guildID: guildID,
            points: 0
        }).catch(err => Logger.db_error(err));

        return new Score(userID, guildID, 0);
    },

    /**
     * Updates the score in the database
     * @param {BigInt} userID
     * @param {BigInt} guildID
     * @param {Integer} points 
     */
    async updatePoints(userID, guildID, points) {
        await this.getScoreData(userID, guildID); //Make sure there is always a user object

        await Scores.increment({
            points: +points
        }, {
            where: {
                userID: userID,
                guildID: guildID
            }
        }).catch(err => Logger.db_error(err));
    }
}