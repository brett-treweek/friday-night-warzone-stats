const axios = require('axios');
const initialArray = require('./initialArray');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const rateLimit = require('axios-rate-limit');
const wait = require('util').promisify(setTimeout);

// Creates axios instance with .env variables/API key.
const axiosInstance = axios.create({
	method: 'GET',
	headers: {
		'x-rapidapi-host': process.env.rapidApiHost,
		'x-rapidapi-key': process.env.rapidApiKey,
	},
});

// Third party package to limit axios calls per second. Needed as free api tier only allows for 1 call per second.
const http = rateLimit(axiosInstance, {
	maxRequests: 1,
	perMilliseconds: 1800,
});

// Function takes players array and sets timeout dependant on players array length to ensure that axios calls have finished before discord edits reply.
const throttle = async (players) => {
	console.log('players length', players.length);
	switch (players.length) {
	case 4:
		await wait(8000);
		break;
	case 3:
		await wait(6500);
		break;
	case 2:
		await wait(4500);
		break;

	default:
		await wait(3000);
		break;
	}
};

// Function that gets userUrl of chosen players from initialArray, makes axios call for each chosen player and appends response(data) to initialArray. Console.time() used to time each axios call because api is unreliable.
const getStats = function(interaction, players) {
	initialArray.forEach((user) => {
		try {
			players.forEach(async (player) => {
				if (user.userName === player) {
					console.time(`${user.userName}`);

					await http
						.get(
							`https://call-of-duty-modern-warfare.p.rapidapi.com/warzone/${user.userUrl}`
						)
						.then((response) => {
							user.stats = response.data.br_all;
							console.log('Initial Array Data:', user);
						})
						.catch(async (error) => {
							console.error('ERROR!!!', error.message);
						});
					console.timeEnd(`${user.userName}`);
				}
			});
		} catch (error) {
			return console.log(error.message);
		}
	});
};

// Embed used when fetching data/ loading.
const loadingEmbed = new MessageEmbed()
	.setColor('DARK_GREY')
	.setTitle('Session Stats')
	.setDescription('Fetching Players...')
	.setThumbnail(
		'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsGP5oFfsKHMwB_y0hhBJqftHla8DWlRI0dw&usqp=CAU'
	)
	.setTimestamp();

// Exported function from this module.
module.exports = async (interaction, players) => {
	await interaction.editReply({ embeds: [loadingEmbed], components: [] });
	await getStats(interaction, players);
	await throttle(players);
	const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId('update')
			.setLabel('Start Session')
			.setStyle('PRIMARY')
	);
	const startEmbed = new MessageEmbed()
		.setColor('DARK_GOLD')
		.setTitle('Warzone Session Stats')
		.setDescription('\u200B')
		.setThumbnail(
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsGP5oFfsKHMwB_y0hhBJqftHla8DWlRI0dw&usqp=CAU'
		)
		.setTimestamp();

	// in operator => returns true if 'stats' property is in initialArray index :)
	const currentPlayerArray = initialArray.filter(
		(current) => 'stats' in current
	);

	// Adds players names and overall K/D.
	currentPlayerArray.map(async (player) => {
		if (player.stats === undefined) {
			interaction.editReply(
				`Something went wrong with ${player.userName}, Please try again`
			);
		} else {
			startEmbed.addFields(
				{ name: `${player.userName}`, value: '\u200B', inline: true },
				{
					name: 'Wins',
					value: `${player.stats.wins}`,
					inline: true,
				},
				{
					name: 'K/D',
					value: `${player.stats.kdRatio.toFixed(3)}`,
					inline: true,
				}
			);
			// Edits discord message with players overview and start session button.
			await interaction.editReply({
				components: [row],
				embeds: [startEmbed],
			});
		}
	});
};
