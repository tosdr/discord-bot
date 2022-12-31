const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const log = require('npmlog');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('giverole')
		.setDescription('Gives the specified user a role')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to give the role to')
				.setRequired(true))
		.addRoleOption(option => 
			option.setName('role')
				.setDescription('The role to give to the user')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
	async execute(interaction) {
		let failed = false;
		const member = interaction.options.getMember('user');
		const role = interaction.options.getRole('role');
		if (member.roles.cache.some(r => r.id === role.id)) {
			const embed = new EmbedBuilder().setColor("#FFA837").setDescription(`**<@${member.user.id}> already has the <@&${role.id}> role!**`);
			return interaction.reply({embeds:[embed]});
		}
		member.roles.add(role).then(function() {
			const embed = new EmbedBuilder().setColor("#27AE60").setDescription(`**Successfully gave <@${member.user.id}> the <@&${role.id}> role!**`);
			interaction.reply({embeds:[embed]});
		}).catch((error) => {
			log.error(error);
			const embed = new EmbedBuilder().setColor("#C44031").setDescription(`**Failed to give <@${member.user.id}> the <@&${role.id}> role!**`);
			interaction.reply({embeds:[embed]});
		});
	},
};
