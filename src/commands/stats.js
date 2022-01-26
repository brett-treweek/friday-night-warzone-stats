const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const initialStats = require('../initialStats');
const rateLimit = require('axios-rate-limit');
const wait = require('util').promisify(setTimeout);

const newDataArray = JSON.parse(JSON.stringify(initialStats));
const dataArray = [];

const Tigmarine =
	'https://call-of-duty-modern-warfare.p.rapidapi.com/warzone/tigmarine%25231353/battle';
const ComTruise =
	'https://call-of-duty-modern-warfare.p.rapidapi.com/warzone/ComTruise%25231678/battle';
const Dirtbagcf =
	'https://call-of-duty-modern-warfare.p.rapidapi.com/warzone/dirtbagcf%25231489/battle';
const Rudwig =
	'https://call-of-duty-modern-warfare.p.rapidapi.com/warzone/Rudwig%25231309/battle';

const axiosInstance = rateLimit(axios.create({
	method: 'GET',
	headers: {
		'x-rapidapi-host': process.env.rapidApiHost,
		'x-rapidapi-key': process.env.rapidApiKey,
	},
}), {
	maxRequests: 1,
	perMilliseconds: 2000,
});

const getStats = async function() {
	try {
		await apiRequest(Tigmarine);
		await apiRequest(ComTruise);
		await apiRequest(Dirtbagcf);
		await apiRequest(Rudwig);
		newDataArray[0].stats = { ...dataArray[0] };
		newDataArray[1].stats = { ...dataArray[1] };
		newDataArray[2].stats = { ...dataArray[2] };
		newDataArray[3].stats = { ...dataArray[3] };
		console.log('newDataArray:', newDataArray);
	} catch (error) {
		console.log(error);
	}
};

const apiRequest = async function(user) {
	await axiosInstance
		.get(user)
		.then((response) => {
			dataArray.push(response.data.br_all);
		})
		.catch((error) => {
			console.log(error);
		});
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Replies with session stats'),
	async execute(interaction) {
		await interaction.deferReply();
		await getStats();
		await wait(5000);

		const statsEmbed = new MessageEmbed()
			.setColor('#00F0FF')
			.setTitle('Friday Night Warzone Night')
			.setDescription('Session Stats')
			.setThumbnail(
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsGP5oFfsKHMwB_y0hhBJqftHla8DWlRI0dw&usqp=CAU'
			)
			.addFields(
				{
					name: '============ Tigmarine ============',
					value: '\u200B',
					inline: true,
				},
				{
					name: 'Kills',
					value: `${
						newDataArray[0].stats.kills -
						initialStats[0].stats.kills
					}`,
					inline: false,
				},
				{
					name: 'Deaths',
					value: `${
						newDataArray[0].stats.deaths -
						initialStats[0].stats.deaths
					}`,
					inline: false,
				},
				{
					name: 'K/D',
					value: `${parseFloat(
						(newDataArray[0].stats.kills -
							initialStats[0].stats.kills) /
							(newDataArray[0].stats.deaths -
								initialStats[0].stats.deaths)
					)}`,
					inline: false,
				},
				{
					name: '============ ComTruise ============',
					value: '\u200B',
					inline: false,
				},
				{
					name: 'Kills',
					value: `${
						newDataArray[1].stats.kills -
						initialStats[1].stats.kills
					}`,
					inline: false,
				},
				{
					name: 'Deaths',
					value: `${
						newDataArray[1].stats.deaths -
						initialStats[1].stats.deaths
					}`,
					inline: false,
				},
				{
					name: 'K/D',
					value: `${parseFloat(
						(newDataArray[1].stats.kills -
							initialStats[1].stats.kills) /
							(newDataArray[1].stats.deaths -
								initialStats[1].stats.deaths)
					)}`,
					inline: false,
				},
				{
					name: '============ Dirtbagcf ============',
					value: '\u200B',
					inline: false,
				},
				{
					name: 'Kills',
					value: `${
						newDataArray[2].stats.kills -
						initialStats[2].stats.kills
					}`,
					inline: false,
				},
				{
					name: 'Deaths',
					value: `${
						newDataArray[2].stats.deaths -
						initialStats[2].stats.deaths
					}`,
					inline: false,
				},
				{
					name: 'K/D',
					value: `${parseFloat(
						(newDataArray[2].stats.kills -
							initialStats[2].stats.kills) /
							(newDataArray[2].stats.deaths -
								initialStats[2].stats.deaths)
					)}`,
					inline: false,
				},
				{
					name: '============ Rudwig ============',
					value: '\u200B',
					inline: false,
				},
				{
					name: 'Kills',
					value: `${
						newDataArray[3].stats.kills -
						initialStats[3].stats.kills
					}`,
					inline: false,
				},
				{
					name: 'Deaths',
					value: `${
						newDataArray[3].stats.deaths -
						initialStats[3].stats.deaths
					}`,
					inline: false,
				},
				{
					name: 'K/D',
					value: `${parseFloat(
						(newDataArray[3].stats.kills -
							initialStats[3].stats.kills) /
							(newDataArray[3].stats.deaths -
								initialStats[3].stats.deaths)
					)}`,
					inline: false,
				},
			)
			.setTimestamp()
			.setFooter({
				text: 'Get better noobs',
			});
		await interaction.editReply({ embeds: [statsEmbed] });
	},
};
