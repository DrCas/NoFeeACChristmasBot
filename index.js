const config = require('./config');
const fs = require('fs');
const Discord = require('discord.js');
const {
    Intents
} = require('discord.js');
const logDNA = require('@logdna/logger');

//Util classes
const ActivityCalculator = require('./util/MessageHandler');
const Activity = require('./components/activity/Activity')
const Logger = require('./util/Logger');

//Database
const db = require('./util/Database');

//Connect to logDNA
logDNALogger = logDNA.createLogger(config.global.logDNA, {
    app: 'NoFeeChristmasBot'
});

const ClientOptions = {
    presence: {
        status: 'online'
    },
    disableMentions: 'everyone',
    disabledEvents: ["TYPING_START"],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'],
    ws: {
        intents: new Intents(Intents.NON_PRIVILEGED)
    }
}

Logger.log('Beginning startup');
const client = new Discord.Client(ClientOptions);
client.commands = new Discord.Collection();
client.activity = new Activity();

fs.readdir('./commands/', (err, folders) => {
    if (err) {
        return Logger.error(err);
    }

    for (let i = 0; i < folders.length; i++) {
        fs.readdir(`./commands/${folders[i]}/`, (error, files) => {
            if (error) {
                return Logger.error(error);
            }

            files.forEach((file) => {
                if (!file.endsWith('.js')) {
                    return;
                }

                const commandFile = require(`./commands/${folders[i]}/${file}`);
                Logger.log(`Started loading command: ${folders[i]}/${commandFile.name}`);
                client.commands.set(commandFile.name, commandFile);
            });
        });
    }
});

Logger.log('Started logging in...');
client.login(config.discord.token);

client.on('ready', async () => {

    //Set bot status.
    Logger.log(`Logged in as ${client.user.tag}. (UserID: ${client.user.id})`);

    //Connect to database after connected to discord.
    await db.sequelize.authenticate()
        .then(() => Logger.db_log('Connected to Database.'))
        .catch(err => {
            Logger.db_error(err);
            Logger.fatal('Database reports no connection. Exiting Process.')
            process.exit(1);
        });
});

client.on('message', async message => {
    if (message.author.bot) return;

    if (message.guild) ActivityCalculator.messageHandler(client.activity, message);

    if (!message.content.startsWith('>')) return;
    let args = message.content.slice(1).split(/ +/);

    //Split arguments and get the command itself
    const command = args.shift().toLowerCase();

    try {
        const commandObject = await client.commands.get(command);
        if (!commandObject) return;

        if (message.guild.me.hasPermission(commandObject.botPermissions)) {
            if (message.member.hasPermission(commandObject.userPermissions)) {
                commandObject.execute(message, args);
                if (config.global.commandRunLogs) Logger.log(`Command: ${command} | ${message.author.id}/${message.guild ? message.guild.id : 'DMs'}`);
            } else {
                message.reply('You do not have permission to use this command.');
            }
        } else {
            let perms = '';
            commandObject.botPermissions.forEach(value => { perms += value.toString() + ' ' });
            message.reply(`I'm missing permissions! I need ${perms}!`);
        }
    } catch (e) {
        Logger.warn('Failed to execute command: ' + command + '. Exception: ' + e);
    }
});

client.on("error", err => Logger.error(err));

client.on('warn', err => Logger.warn(err));

client.on('disconnect', event => {
    Logger.fatal(`Disconnected with code ${event.code}.`);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    Logger.error(`Unhandled Rejection at Promise: ${promise}\nError: ${reason}\nStack Trace: ${reason.stack}`);
});