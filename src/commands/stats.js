const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const initialStats = require('../initialStats');

const options = {
	method: 'GET',
	url: 'https://call-of-duty-modern-warfare.p.rapidapi.com/warzone/tigmarine%25231353/battle',
	headers: {
		'x-rapidapi-host': process.env.rapidApiHost,
		'x-rapidapi-key': process.env.rapidApiKey,
	},
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('replies with stats'),
	async execute(interaction) {
		const newStats = {
			kills: 0,
			deaths: 0,
			games: 0,
		};

		console.log(initialStats);
		interaction.reply('yay');

		// await axios
		// 	.request(options)
		// 	.then((response) => {
		// 		console.log(response.data);
		// 		newStats.deaths = response.data.br_all.deaths;
		// 		newStats.games = response.data.br_all.gamesPlayed;
		// 		newStats.kills = response.data.br_all.kills;
		// 	})
		// 	.then(() => {
		// 		console.log(initialStats);
		// 		const stats = {
		// 			kills: newStats.kills - initialStats.kills,
		// 			deaths: newStats.deaths - initialStats.deaths,
		// 			games: newStats.games - initialStats.games,
		// 			kd: 0,
		// 		};
		// 		stats.kd = stats.kills / stats.deaths;
		// 		interaction.reply(`Session Stats
		// 		Tigmarine:
		// 		kills = ${stats.kills}
		// 		deaths = ${stats.deaths}
		// 		games = ${stats.games}
		// 		k/d = ${stats.kd || 'play some games yo'}`);
		// 	})
		// 	.catch((error) => {
		// 		console.log(error);
		// 	});
	},
};
