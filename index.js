const dotenv = require('dotenv');
// Check for --dev option
if (process.argv.includes('--dev')) {
    dotenv.config({path: '.env.dev'});
} else {
    dotenv.config({path: '.env'});
}

const {token, clientId} = process.env;
const {REST, Routes, Client, GatewayIntentBits, codeBlock} = require('discord.js');

const commands = [
    {
        name: '도움말',
        description: '사용법 설명'
    }
];

const rest = new REST('10').setToken(token);

const getRandomInt = (min, max) => Math.floor(
    Math.random() * (max - Math.ceil(min))
) + Math.ceil(min);

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const fs = require('fs');
const help = fs
    .readFileSync("help.md")
    .toString();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    const {content, channel, author} = message;

    if (!channel.name.includes('확률') || author.bot) 
        return;
    
    if (content.includes('확률')) {
        const value = getRandomInt(0, 100);
        const replacedContent = content.replace('?', '');
        let res = '';

        if (['나', '너', '내', '니'].some(element => replacedContent.includes(element))) {
            res += '그 확률은';
            res += ' ';
            res += `${value}% 입니다.`;
        } else {
            res += replacedContent;
            res += ' '
            res += `${value}% 입니다.`;
        }
        channel.send(res);
        return;
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand() && interaction.commandName === '도움말') {
        await interaction.reply({content: codeBlock(help), ephemeral: true});
    }
});

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(clientId), {body: commands});
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.login(token);