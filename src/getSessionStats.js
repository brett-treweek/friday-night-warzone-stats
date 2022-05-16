const axios = require('axios');
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

// Function used to get an average of kills/deaths and set to three decimals.
const average = function(x, y) {
	if (isNaN(x / y)) {
		return 0;
	}
	return (x / y).toFixed(3);
};

// Function takes players array and sets timeout dependant on players array length to ensure that axios calls have finished before discord edits reply.
const throttle = async function(playerArray) {
	switch (playerArray.length) {
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
		await wait(2000);
		break;
	}
};

// Function to loop through players in playerArray make axios request to api to get latest user stats.
const sessionStats = function(playerArray) {
	try {
		playerArray.forEach(async (user) => {
			console.time(user.userName);
			await http
				.get(
					`https://call-of-duty-modern-warfare.p.rapidapi.com/warzone/${user.userUrl}`
				)
				.then((response) => {
					user.stats = response.data.br_all;
					console.log('Session Stats Data:', user);
				});
			console.timeEnd(user.userName);
		});
	} catch (error) {
		console.log('Error with axios request', error.message);
	}
};

module.exports = async (interaction) => {
	// Buttons- refresh stats, change players(disabled), end session.
	const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId('update')
			.setLabel('Refresh Stats')
			.setStyle('SUCCESS'),
		new MessageButton()
			.setCustomId('setPlayers')
			.setLabel('Change Players')
			.setStyle('PRIMARY')
			.setDisabled(true),
		new MessageButton()
			.setCustomId('delete')
			.setLabel('End Session')
			.setStyle('DANGER')
	);
	// Disabled buttons used when fetching data/ loading.
	const disabledRow = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId('update')
			.setLabel('Refresh Stats')
			.setStyle('SUCCESS')
			.setDisabled(true),
		new MessageButton()
			.setCustomId('setPlayers')
			.setLabel('Change Players')
			.setStyle('PRIMARY')
			.setDisabled(true),
		new MessageButton()
			.setCustomId('delete')
			.setLabel('End Session')
			.setStyle('DANGER')
			.setDisabled(true)
	);

	// Embed used when fetching data/ loading.
	const loadingEmbed = new MessageEmbed()
		.setColor('DARK_GREY')
		.setTitle('Session Stats')
		.setDescription('Fetching Stats...')
		.setThumbnail(
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsGP5oFfsKHMwB_y0hhBJqftHla8DWlRI0dw&usqp=CAU'
		)
		.setTimestamp();

	// Embed used after fetching data to show updated stats. This embed will have stats added to dynamically in line 154 below.
	const sessionEmbed = new MessageEmbed()
		.setColor('DARK_GREEN')
		.setTitle('Warzone Session Stats')
		.setDescription('\u200B')
		.setThumbnail(
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsGP5oFfsKHMwB_y0hhBJqftHla8DWlRI0dw&usqp=CAU'
		)
		.setTimestamp();

	await interaction.deferUpdate();
	await interaction.editReply({
		components: [disabledRow],
		embeds: [loadingEmbed],
	});
	const initialArray = require('./initialArray');
	const playerArray = [];

	// Map function - makes copy of initialArray so I dont mutate initialArray as I still need initial stats for comparison.
	initialArray.map((i) => {
		const iCopy = { ...i };
		if ('stats' in iCopy) {
			playerArray.push(iCopy);
		}
	});

	// SessionStats function gets updated stats for playerArray.
	sessionStats(playerArray);
	// Set timeout based on how many api calls needed.
	await throttle(playerArray);

	// Function to compare playerArray stats to initialArray stats. Adds difference in stats to discord message.
	playerArray.map((s) => {
		if (s.stats === undefined) {
			return interaction.editReply(
				`Something went wrong with ${s.userName}, Please try again`
			);
		} else {
			initialArray.map((i) => {
				if (s.userName === i.userName) {
					sessionEmbed.addFields(
						{
							name: `============ ${s.userName} ============`,
							value: `Games Played: ${
								s.stats.gamesPlayed - i.stats.gamesPlayed
							}`,
							inline: false,
						},
						{
							name: 'Kills',
							value: `${parseInt(s.stats.kills - i.stats.kills)}`,
							inline: false,
						},
						{
							name: 'Deaths',
							value: `${parseInt(
								s.stats.deaths - i.stats.deaths
							)}`,
							inline: false,
						},
						{
							name: 'K/D',
							value: `${average(
								s.stats.kills - i.stats.kills,
								s.stats.deaths - i.stats.deaths
							)}`,
							inline: false,
						},
						{
							name: 'Downs',
							value: `${parseInt(s.stats.downs - i.stats.downs)}`,
							inline: false,
						}
					);
				}
			});
		}
	});

	// Edited reply to discord with updated session stats.
	await interaction.editReply({ components: [row], embeds: [sessionEmbed] });
};
