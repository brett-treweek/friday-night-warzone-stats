const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const initialStats = require('../initialStats');

let newDataArray = [];

const tigmarine =
	'https://call-of-duty-modern-warfare.p.rapidapi.com/warzone/tigmarine%25231353/battle';
const comTruise =
	'https://call-of-duty-modern-warfare.p.rapidapi.com/warzone/ComTruise%25231678/battle';
const dirtbagcf =
	'https://call-of-duty-modern-warfare.p.rapidapi.com/warzone/dirtbagcf%25231489/battle';
const rudwig =
	'https://call-of-duty-modern-warfare.p.rapidapi.com/warzone/Rudwig%25231309/battle';

const axiosInstance = axios.create({
	method: 'GET',
	headers: {
		'x-rapidapi-host': process.env.rapidApiHost,
		'x-rapidapi-key': process.env.rapidApiKey,
	},
});

const apiRequest = async function(user) {
	await axiosInstance
		.get(user)
		.then((response) => {
			newDataArray.push(response.data.br_all);
			console.log('newDataArray:', newDataArray);
		})
		.catch((error) => {
			console.log(error);
		});
};

const getStats = async function() {
	await apiRequest(tigmarine)
		// .then(async () => {
		// 	await apiRequest(comTruise);
		// })
		// .then(async () => {
		// 	await apiRequest(dirtbagcf);
		// })
		// .then(async () => {
		// 	await apiRequest(rudwig);
		// })
		.catch((error) => {
			console.log(error);
		});
};


module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Replies with session stats'),
	async execute(interaction) {
		newDataArray = [];
		await getStats();

		const startEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Friday Night Warzone Night')
			.setDescription('Session Initialised')
			.setTimestamp()
			.setThumbnail(
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsGP5oFfsKHMwB_y0hhBJqftHla8DWlRI0dw&usqp=CAU'
			)
			.addField('\u200B', '\u200B')
			.addFields(
				{ name: '\u200B', value: '\u200B', inline: false },
				{ name: 'Tigmarine', value: '\u200B', inline: true },
				{
					name: 'Kills',
					value: `${
						newDataArray[0].kills - initialStats[0].stats.kills
					}`,
					inline: true,
				}
			)
			.setTimestamp()
			.setFooter({
				text: 'Get better noobs',
			});
		await interaction.reply({ embeds: [startEmbed] });
	},
};

// const { SlashCommandBuilder } = require('@discordjs/builders');
// const axios = require('axios');
// const initialStats = require('../initialStats');

// const options = {
// 	method: 'GET',
// 	url: 'https://call-of-duty-modern-warfare.p.rapidapi.com/warzone/tigmarine%25231353/battle',
// 	headers: {
// 		'x-rapidapi-host': process.env.rapidApiHost,
// 		'x-rapidapi-key': process.env.rapidApiKey,
// 	},
// };

// module.exports = {
// 	data: new SlashCommandBuilder()
// 		.setName('stats')
// 		.setDescription('replies with session stats'),
// 	async execute(interaction) {
// 		const newStats = {
// 			kills: 0,
// 			deaths: 0,
// 			games: 0,
// 		};

// 		console.log(initialStats);
// 		interaction.reply('yay');

// 		await axios
// 			.request(options)
// 			.then((response) => {
// 				console.log(response.data);
// 				newStats.deaths = response.data.br_all.deaths;
// 				newStats.games = response.data.br_all.gamesPlayed;
// 				newStats.kills = response.data.br_all.kills;
// 			})
// 			.then(() => {
// 				console.log(initialStats);
// 				const stats = {
// 					kills: newStats.kills - initialStats.kills,
// 					deaths: newStats.deaths - initialStats.deaths,
// 					games: newStats.games - initialStats.games,
// 					kd: 0,
// 				};
// 				stats.kd = stats.kills / stats.deaths;
// 				interaction.reply(`Session Stats
// 				Tigmarine:
// 				kills = ${stats.kills}
// 				deaths = ${stats.deaths}
// 				games = ${stats.games}
// 				k/d = ${stats.kd || 'play some games yo'}`);
// 			})
// 			.catch((error) => {
// 				console.log(error);
// 			});
// 	},
// };
