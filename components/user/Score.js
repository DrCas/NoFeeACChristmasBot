class Score {

    /**
     * Create a new Score
     * @param {BigInt} userID 
     * @param {BigInt} guildID
     * @param {*} points 
     */
    constructor(userID, guildID, points) {
        this.userID = userID;
        this.guildID = guildID;
        this.points = points;
    }

    /**
     * Adds points to the users total
     * @param {*} points The amount of points to add (can be negative)
     */
    addPoints(points) {
        this.points += points;
    }

    /**
     * Returns the UserID
     */
    getUserID() {
        return this.userID;
    }

    /**
     * Returns the GuildID
     */
    getGuildID() {
        return this.guildID;
    }

    /**
     * Returns the amount of points, as stored in memory.
     */
    getPoints() {
        return this.points;
    }
}

module.exports = Score;