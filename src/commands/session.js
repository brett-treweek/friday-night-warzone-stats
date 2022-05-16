const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu,
} = require('discord.js');


module.exports = {
	// creates instance of slash command builder with '/session' command. This command is used to initialize app and will reply with start embed and 'select players' select menu as a response.
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
						value: 'Tigmarine',
					},
					{
						label: 'Rudwig',
						value: 'Rudwig',
					},
					{
						label: 'ComTruise',
						value: 'ComTruise',
					},
					{
						label: 'Dirtbagcf',
						value: 'Dirtbagcf',
					},
					{
						label: 'Stubbie',
						value: 'Stubbie',
					},
				])
		);

		await interaction.reply({
			embeds: [startEmbed],
			// content: 'Select Team Members',
			components: [row],
		});
	},
};
