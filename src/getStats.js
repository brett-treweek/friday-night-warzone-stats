const axios = require('axios');
const initialArray = require('./initialArray');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const rateLimit = require('axios-rate-limit');
const wait = require('util').promisify(setTimeout);

const axiosInstance = axios.create({
	method: 'GET',
	headers: {
		'x-rapidapi-host': process.env.rapidApiHost,
		'x-rapidapi-key': process.env.rapidApiKey,
	},
});

const http = rateLimit(axiosInstance, {
	maxRequests: 1,
	perMilliseconds: 1500,
});

const getStats = function(players) {
	try {
		initialArray.map((user) => {
			players.forEach(async (player) => {
				if (user.userName === player) {
					await http
						.get(
							`https://call-of-duty-modern-warfare.p.rapidapi.com/warzone/${user.userUrl}`
						)
						.then((response) => {
							user.stats = response.data.br_all;
							console.log('Initial Array Map:', user);
						});
				}
			});
		});
	} catch (error) {
		return console.log(error.message);
	}
};

module.exports = async (interaction, players) => {
	await getStats(players);
	await wait(8000);
	console.log('getStats players prop:', players, initialArray);
	const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId('update')
			.setLabel('Start')
			.setStyle('PRIMARY')
	);
	const startEmbed = new MessageEmbed()
		.setColor('DARK_VIVID_PINK')
		.setTitle('Friday Night Warzone Night')
		.setDescription('Selected Players')
		.setThumbnail(
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsGP5oFfsKHMwB_y0hhBJqftHla8DWlRI0dw&usqp=CAU'
		)
		.setTimestamp();

	console.log('getStats Axios reply:', initialArray);
	// in operator => returns true if 'stats' property is in initialArray index :)
	const currentPlayerArray = initialArray.filter((current) => 'stats' in current);

	console.log('currentPlayerArray:', currentPlayerArray);

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
			await interaction.editReply({
				components: [row],
				embeds: [startEmbed],
			});
		}
	});
};
