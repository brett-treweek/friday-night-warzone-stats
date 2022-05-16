const { Client, Collection, Intents } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const getSessionStats = require('./getSessionStats');
const getStats = require('./getStats');
const initialArray = require('./initialArray');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();

const commandFiles = fs
	.readdirSync('./src/commands')
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}


client.once('ready', () => {
	console.log(`${client.user.username} has logged in!`);
});

// Command Handling by discord.js. Slash, Select-Menu, Buttons.
client.on('interactionCreate', async (interaction) => {
	// /session Slash command to start app.
	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error('slash command error:', error.message);
			return await interaction.reply({
				content: 'There was an error while executing this command!',
			});
		}

	} else if (interaction.isSelectMenu()) {
		// Select Menu to choose players.
		try {
			if (interaction.customId == 'selected-players') {
				const players = interaction.values;
				await interaction.deferUpdate();
				await getStats(interaction, players);
			}
		} catch (error) {
			console.log('select menu error:', error.message);
			return await interaction.reply({
				content: 'There was an error while executing this command!',
			});
		}

	} else if (interaction.isButton()) {
		// Buttons to refresh stats, and end session. Change players button is disabled because functionality not yet implemented.
		try {
			if (interaction.customId == 'update') {
				await getSessionStats(interaction);
			} else if (interaction.customId == 'delete') {
				initialArray.forEach((i) => delete i.stats);
				await interaction.update({ content: 'session ended', components: [] });
				console.log(
					'session ended',
					interaction.customId
				);
			}
		} catch (error) {
			console.log(error.message);
			return interaction.reply({
				content: 'There was an error while executing this command!',
			});
		}
	}
});

// Connecting to discord client with .env variables.
client.login(process.env.token);
