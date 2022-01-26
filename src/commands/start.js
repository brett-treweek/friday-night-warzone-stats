const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const initialStats = require('../initialStats');
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

const getStats = function() {
	try {
		initialStats.map(async (user) => {
			await http
				.get(
					`https://call-of-duty-modern-warfare.p.rapidapi.com/warzone/${user.userUrl}`
				)
				.then((response) => {
					user.stats = response.data.br_all;
				})
				.catch((error) => {
					console.log(error.message);
				});
		});
	} catch (error) {
		console.log(error);
	}
};

const startEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Friday Night Warzone Night')
	.setDescription('Session Initialised')
	.addField('\u200B', '\u200B')
	.setThumbnail(
		'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsGP5oFfsKHMwB_y0hhBJqftHla8DWlRI0dw&usqp=CAU'
	)
	.addField('Session Stats!', 'To get session stats, type "/stats" in chat.')
	.addField('\u200B', '\u200B')
	.setTimestamp()
	.setFooter({
		text: 'Get better noobs',
	});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Initialises warzone stats'),
	async execute(interaction) {
		await interaction.deferReply();
		await getStats();
		await wait(8000);
		console.log('Initial Stats:', initialStats);
		initialStats.map((player) => {
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
		});
		interaction.editReply({ embeds: [startEmbed] });
	},
};
