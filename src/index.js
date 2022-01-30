const { Client, Collection, Intents } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const getStats = require('./getStats');
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

client.on('interactionCreate', async (interaction) => {
	if (interaction.isCommand()) {
		if (!interaction.isCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error.message);
			return interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	} else if (interaction.isSelectMenu()) {
		try {
			if (interaction.customId == 'selected-players') {
				console.log('selected players', interaction.values);
				await interaction.reply('Done yo');
				getStats(interaction);
			}
		} catch (error) {
			console.log(error.message);
		}
	}
});

client.login(process.env.token);
