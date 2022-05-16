const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
require('dotenv').config();


const clientId = process.env.clientId;
const guildId = process.env.guildId;
const token = process.env.token;

const commands = [];

// Selects only js files within commands folder.
const commandFiles = fs
	.readdirSync('./src/commands')
	.filter((file) => file.endsWith('.js'));

// Creates commands array with above command files.
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// creates new rest instance with authentication token from .env
const rest = new REST({ version: '9' }).setToken(token);

// Registers commands with discord server upon excecution of this file.
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Succesfully registered application commands.'))
	.catch('ERROR!!!!', console.error);
