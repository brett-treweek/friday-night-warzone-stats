const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const nodeHtmlToImage = require('node-html-to-image');
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
		let cards = '';

		await interaction.deferReply();
		getStats(sessionArray);
		await wait(8000);

		sessionArray.map((s) => {
			if (s.stats === undefined) {
				return interaction.editReply(
					`Something went wrong with ${s.userName}, Please try again`
				);
			} else {
				initialArray.map((i) => {
					if (s.userName === i.userName) {
						cards = cards.concat(
							`<div class="card">
								<h3>${s.userName}</h3>
								<ul>
									<li> Kills: ${parseInt(s.stats.kills - i.stats.kills)}</li>
									<li> Deaths: ${parseInt(s.stats.deaths - i.stats.deaths)}</li>
									<li> K/D: ${average(s.stats.kills - i.stats.kills, s.stats.deaths - i.stats.deaths)}</li>
								</ul>
							<div>`);
					}
				});
			}
		});

		const template = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="X-UA-Compatible" content="IE=edge">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Document</title>
				<style>
					body {
				height: 100vh;
				font-family: Arial, Helvetica, sans-serif;
                max-width: 300px;
			}
			h1 {
				font-size: 25px;
				font-weight: 400;
			}
			h3 {
                letter-spacing: 0.1ch;
				font-weight: 200;
				font-size: 18px;
                margin-bottom: 0;
			}
			.container {
                max-width: 300px;
                background-image: url('https://preview.redd.it/uiehsutl24h51.jpg?auto=webp&s=7cd5e5b778cbecc70ef0f54ef133cff7a1e20df3');
				padding: 1rem;
				/* height: 70vh; */
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				color: #fff;
			}
			.card {
                width: 100%;
				border-radius: 10px;
				box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
				margin-bottom: 1rem;
				display: flex;
				flex-direction: column;
				background-color: rgb(30, 80, 72);
				align-items: center;
                justify-content: center;
			}
			ul {
				list-style: none;
                padding: 0;
                margin: 0;
			}
			li {
                margin: 1rem;
				font-size: 12px;
			}
				</style>
			</head>
			<body>
				<div class="container">
					<h1>Warzone Session Stats</h1>
					${cards}
				</div>
			</body>
			</html>
		`;

		const images = await nodeHtmlToImage({
			html: template,
			quality: 100,
			type: 'jpeg',
			puppeteerArgs: {
				args: ['--no-sandbox'],
			},
			encoding: 'buffer',
		});

		const attatch = new MessageAttachment(images, 'brett.jpeg');

		await interaction.editReply({ files:  [attatch] });
	},
};

// {
// 	statsEmbed.addFields(
// 		{
// 			name: `============ ${s.userName} ============`,
// 			value: '\u200B',
// 			inline: false,
// 		},
// 		{
// 			name: 'Kills',
// 			value: `${parseInt(s.stats.kills - i.stats.kills)}`,
// 			inline: false,
// 		},
// 		{
// 			name: 'Deaths',
// 			value: `${parseInt(s.stats.deaths - i.stats.deaths)}`,
// 			inline: false,
// 		},
// 		{
// 	name: 'K/D',
// 	value: `${average(
// 		s.stats.kills - i.stats.kills,
// 		s.stats.deaths - i.stats.deaths
// 	)}`,
// 	inline: false,
// },
// 		{
// 			name: 'Downs',
// 			value: `${parseInt(s.stats.downs - i.stats.downs)}`,
// 			inline: false,
// 		}
// 	);
// }