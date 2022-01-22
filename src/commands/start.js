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
		.setName('start')
		.setDescription('Initialises warzone stats'),
	async execute(interaction) {
		await axios
			.request(options)
			.then((response) => {
				console.log(response.data);
				initialStats.deaths = response.data.br_all.deaths;
				initialStats.games = response.data.br_all.gamesPlayed;
				initialStats.kills = response.data.br_all.kills;
				initialStats.kd = response.data.br_all.kdRatio;
			})
			.then(() => {
				interaction.reply(` Initialised Warzone Session!
				Tigmarines overall stats:
				kills = ${initialStats.kills}
				deaths = ${initialStats.deaths}
				games = ${initialStats.games}
				k/d = ${initialStats.kd}`);
			})
			.catch((error) => {
				console.log(error);
			});
	},
};
