const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const initialStats = require('../initialStats');

const dataArray = [];

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
			dataArray.push(response.data.br_all);
			initialStats[0].stats = { ...dataArray[0] };
			initialStats[1].stats = { ...dataArray[1] };
			initialStats[2].stats = { ...dataArray[2] };
			initialStats[3].stats = { ...dataArray[3] };
			console.log('InitialStats:', initialStats);
		})
		.catch((error) => {
			console.log(error);
		});
};

const getStats = async function() {
	await apiRequest(tigmarine)
		.then(async () => {
			await apiRequest(comTruise);
		})
		.then(async () => {
			await apiRequest(dirtbagcf);
		})
		.then(async () => {
			await apiRequest(rudwig);
		})
		.catch((error) => {
			console.log(error);
		});
};

getStats();

const startEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Friday Night Warzone Night')
	.setDescription('Session Initialised')
	.setTimestamp()
	.setThumbnail(
		'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsGP5oFfsKHMwB_y0hhBJqftHla8DWlRI0dw&usqp=CAU'
	)
	.addField('\u200B', '\u200B')
	.addField('Session Stats!', 'To get session stats, type "/stats" in chat.')
	.setTimestamp()
	.setFooter({
		text: 'Get better noobs',
	});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Initialises warzone stats'),
	async execute(interaction) {
		startEmbed.addFields(
			{ name: '\u200B', value: '\u200B', inline: false },
			{ name: 'Tigmarine', value: '\u200B', inline: true },
			{
				name: 'Wins',
				value: `${initialStats[0].stats.wins}`,
				inline: true,
			},
			{
				name: 'K/D',
				value: `${initialStats[0].stats.kdRatio.toFixed(3)}`,
				inline: true,
			},
			{ name: 'ComTruise', value: '\u200B', inline: true },
			{
				name: 'Wins',
				value: `${initialStats[1].stats.wins}`,
				inline: true,
			},
			{
				name: 'K/D',
				value: `${initialStats[1].stats.kdRatio.toFixed(3)}`,
				inline: true,
			},
			{ name: 'Dirtbagcf', value: '\u200B', inline: true },
			{
				name: 'Wins',
				value: `${initialStats[2].stats.wins}`,
				inline: true,
			},
			{
				name: 'K/D',
				value: `${initialStats[2].stats.kdRatio.toFixed(3)}`,
				inline: true,
			},
			{ name: 'Rudwig', value: '\u200B', inline: true },
			{
				name: 'Wins',
				value: `${initialStats[3].stats.wins}`,
				inline: true,
			},
			{
				name: 'K/D',
				value: `${initialStats[3].stats.kdRatio.toFixed(3)}`,
				inline: true,
			}
		);
		await interaction.reply({ embeds: [startEmbed] });
	},
};
