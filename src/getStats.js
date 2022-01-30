// const axios = require('axios');
const initialArray = require('./initialArray');
const {
	MessageEmbed,
	MessageActionRow,
	MessageButton
} = require('discord.js');
// const rateLimit = require('axios-rate-limit');
// const wait = require('util').promisify(setTimeout);

module.exports = async (interaction) => {
	const row = new MessageActionRow()
		.addComponents(
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
		.setTimestamp()
		.setFooter({
			text: 'Get better noobs',
		});
	console.log('interaction.values', interaction.customId);
	await interaction.editReply({ components: [row], embeds: [startEmbed] });
};
