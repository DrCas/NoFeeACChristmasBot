# NoFeeACChristmasBot

A custom bot created for the NoFeeAC discord for Christmas & New years eve, database structure is not included but can be deduced from the components folder.

Config file should look like this:

```
module.exports = {
    global: {
        commandRunLogs: true,
        logDNA: 'API KEY HERE',
        enableLogDNA: false,
        enableLogToFile: false
    },
    database: {
        host: 'HOSTNAME HERE',
        port: 5432,
        name: 'DB NAME HERE',
        username: 'DB USERNAME HERE',
        password: 'DB PASSWORD HERE'
    },
    discord: {
        token: 'TOKEN HERE',
        appID: 'APP ID HERE',
        publicKey: 'KEY HERE',
        owners: ['BOT OWNERS HERE'],
        author: 'BOT OWNER HERE'
    },
    game: {
        modifier: 1.0,
        popupChance: 1,
        answerTime: 15,
        grinchPopupChance: 0.05
    }
}
```
