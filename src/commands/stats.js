const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const userDeets = require('../userDeets');
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
	} return (x / y).toFixed(3);
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
		console.log(error);
	}
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Replies with session stats'),
	async execute(interaction) {
		const statsEmbed = new MessageEmbed()
			.setColor('#00F0FF')
			.setTitle('Session Stats')
			.setThumbnail(
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsGP5oFfsKHMwB_y0hhBJqftHla8DWlRI0dw&usqp=CAU'
			)
			.setTimestamp()
			.setFooter({
				text: 'Get better noobs',
			});

		const sessionArray = userDeets.map((x) => x);
		const initialArray = require('../initialArray');

		console.log('initialArray in stats command!', initialArray);

		await interaction.deferReply();
		getStats(sessionArray);

		await wait(8000);

		console.log('Session Stats:', sessionArray);

		sessionArray.map((s) => {
			if (s.stats === undefined) {
				return interaction.editReply(
					`Something went wrong with ${s.userName}, Please try again`
				);
			} else {
				initialArray.map((i) => {
					if (s.userName === i.userName) {
						{
							statsEmbed.addFields(
								{
									name: `============ ${s.userName} ============`,
									value: '\u200B',
									inline: false,
								},
								{
									name: 'Kills',
									value: `${parseInt(
										s.stats.kills - i.stats.kills
									)}`,
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
									value: `${parseInt(
										s.stats.downs - i.stats.downs
									)}`,
									inline: false,
								}
							);
						}
					}
				});
			}
		});
		await interaction.editReply({ embeds: [statsEmbed] });
	},
};
