const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { tosdrApiKey, embedColor } = require('../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('phoenix')
		.setDescription('Phoenix admin commands.')
		.addSubcommand(command => command
			.setName('purge')
			.setDescription('Purges all Phoenix comments from the specified user.')
			.addIntegerOption(option =>
				option.setName('user_id')
					.setDescription('The user ID to purge messages from')
					.setRequired(true)))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, confirmed = false, user_id = -1, type = -1) {
		if (interaction.options != undefined) { if (interaction.options.getSubcommand() == "purge" && !confirmed) {
			const userID = interaction.options.getInteger('user_id');
			const options = {
				method: 'DELETE',
				headers: {apiKey: tosdrApiKey}
			};
			const response = await fetch(`https://api.tosdr.org/spam/v1/?user=${userID}&dryrun=true`, options)
				.then(res => res.json())
				.catch(err => {
					log.error('error:' + err)
				});

			if (!(response.error & 0x100)) {
				const embed = new EmbedBuilder()
					.setColor("#C44031")
					.setTitle("An error occurred while processing your request!")
					.setDescription(`\`\`\`\n${response.message}\`\`\``);
				return interaction.reply({embeds:[embed], content:'', components:[], ephemeral: true});
			}
	
			const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(`phoenixPurgeConfirm-${userID}`)
					.setLabel('Yes')
					.setStyle(ButtonStyle.Primary),
			);
			await interaction.reply({ content: `**Are you sure you want to purge all comments for user ${response.parameters.user.username}?**`, components: [row] });	
		}} else {
			if (type == 0) {
				// Terrible janky way of getting the userID when button is pressed
				const options = {
					method: 'DELETE',
					headers: {apiKey: tosdrApiKey}
				};
				const response = await fetch(`https://api.tosdr.org/spam/v1/?user=${user_id}`, options)
					.then(res => res.json())
					.catch(err => {
						log.error('error:' + err)
					});
				
				
				const comments = response.parameters.comments;
				const user = response.parameters.user;
				const isDeactivated = (response.parameters.user.deactivated) ? 'is' : 'is not'
				const embed = new EmbedBuilder()
					.setColor("#27AE60")
					.setTitle(`Successfully purged ${comments.total} comments from user ${user.username} (${user.id})`)
					.setDescription(`**Cases:** ${comments.case.total} (${comments.case.failed} failed)\n**Documents:** ${comments.document.total} (${comments.document.failed} failed)\n**Points:** ${comments.point.total} (${comments.point.failed} failed)\n**Services:** ${comments.service.total} (${comments.service.failed} failed)`)
					.setFooter({text:`Users account ${isDeactivated} deactivated`});
				
				await interaction.update({embeds:[embed], content:'', components:[]});
			}
		}
	},
};
