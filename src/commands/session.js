const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('session')
		.setDescription('Sets team members for session'),

	async execute(interaction) {
		const startEmbed = new MessageEmbed()
			.setColor('DARK_GOLD')
			.setTitle('Friday Night Warzone Night')
			.setDescription('Select Players')
			.setThumbnail(
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsGP5oFfsKHMwB_y0hhBJqftHla8DWlRI0dw&usqp=CAU'
			)
			.setTimestamp()
			.setFooter({
				text: 'Get better noobs',
			});

		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId('selected-players')
				.setPlaceholder('Select Players')
				.setMinValues(1)
				.setMaxValues(4)
				.addOptions([
					{
						label: 'Tigmarine',
						value: 'tigmarine%25231353/battle',
					},
					{
						label: 'Rudwig',
						value: 'Rudwig%25231309/battle',
					},
					{
						label: 'Comtruise',
						value: 'ComTruise%25231678/battle',
					},
					{
						label: 'Dirtbagcf',
						value: 'dirtbagcf%25231489/battle',
					},
					{
						label: 'Stubbie',
						value: 'stubbie2002%25231337/battle',
					},
				])
		);
		await interaction.reply({
			embeds: [startEmbed],
			content: 'Select Team Members',
			components: [row],
		});
	},
};
