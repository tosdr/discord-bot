const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const log = require('npmlog');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('takerole')
		.setDescription('Removes the specified role from a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to take the role from')
				.setRequired(true))
		.addRoleOption(option => 
			option.setName('role')
				.setDescription('The role to take from the user')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
	async execute(interaction) {
		const member = interaction.options.getMember('user');
		const role = interaction.options.getRole('role');
		if (!member.roles.cache.some(r => r.id === role.id)) {
			const embed = new EmbedBuilder().setColor("#FFA837").setDescription(`**<@${member.user.id}> doesn't have the <@&${role.id}> role!**`);
			return interaction.reply({embeds:[embed]});
		}
		member.roles.remove(role).then(function() {
			const embed = new EmbedBuilder().setColor("#27AE60").setDescription(`**Successfully took the <@&${role.id}> role from <@${member.user.id}>!**`);
			interaction.reply({embeds:[embed]});	
		}).catch((error) => {
			log.error(error);
			const embed = new EmbedBuilder().setColor("#C44031").setDescription(`**Failed to take the <@&${role.id}> role from <@${member.user.id}>!**`);
			interaction.reply({embeds:[embed]});
		});
	},
};
