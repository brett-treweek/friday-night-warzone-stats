// const axios = require('axios');
// const initialArray = require('./initialArray');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
// const rateLimit = require('axios-rate-limit');
const wait = require('util').promisify(setTimeout);

module.exports = async (interaction) => {
	const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId('update')
			.setLabel('Refresh Stats')
			.setStyle('SUCCESS')
		,
		new MessageButton()
			.setCustomId('setPlayers')
			.setLabel('Change Players')
			.setStyle('PRIMARY')
		,
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
		.setTimestamp()
		.setFooter({
			text: 'Get better noobs',
		});
	// console.log('getSessionStats interaction', interaction);
	await interaction.deferUpdate();
	await wait(1000);
	await interaction.editReply({ components: [row], embeds: [sessionEmbed] });
};
