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
	perMilliseconds: 2000,
});

const average = function(x, y) {
	if (isNaN(x / y)) {
		return 0;
	}
	return (x / y).toFixed(3);
};

const getStats = function(sessionArray) {
	try {
		sessionArray.map(async (user) => {
			await http
				.get(
					`https://call-of-duty-modern-warfare.p.rapidapi.com/warzone/${user.userUrl}`
				)
				.then((response) => {
					user.stats = response.data.br_all;
					console.log('Session Stats Map:', user);
				});
		});
	} catch (error) {
		return console.log('Error with axios request', error.message);
	}
};

module.exports = async (interaction) => {
	console.log('Start Button Pressed InitialArray:', initialArray);

	const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId('update')
			.setLabel('Refresh Stats')
			.setStyle('SUCCESS'),
		new MessageButton()
			.setCustomId('setPlayers')
			.setLabel('Change Players')
			.setStyle('PRIMARY'),
		new MessageButton()
			.setCustomId('delete')
			.setLabel('End Session')
			.setStyle('DANGER')
	);
	const sessionEmbed = new MessageEmbed()
		.setColor('DARK_VIVID_PINK')
		.setTitle('Session Stats')
		.setDescription(
			'Session stats updated every 5 mins or on demand by clicking update'
		)
		.setThumbnail(
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsGP5oFfsKHMwB_y0hhBJqftHla8DWlRI0dw&usqp=CAU'
		)
		.setTimestamp();


	await interaction.deferUpdate();
	const sessionArray = initialArray.filter((current) => 'stats' in current);
	getStats(sessionArray);
	await wait(8000);

	console.log('session and initial:', sessionArray, initialArray);


	sessionArray.map((s) => {
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


	await interaction.editReply({ components: [row], embeds: [sessionEmbed] });
};
