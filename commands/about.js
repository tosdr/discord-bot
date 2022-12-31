const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { version, dependencies, homepage, author } = require('../package.json');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Displays information about the bot'),
	async execute(interaction) {
		const { client } = require("../bot.js");
		const embed = new EmbedBuilder()
			.setColor(embedColor)
			.setTitle(`About ${client.user.username}`)
			.setDescription("Hi, I'm T.O.D.D., your **TO**s;**D**R **D**iscord Bot!")
			.addFields(
				{ name: 'Ping', value: `${client.ws.ping}ms`, inline: true },
				{ name: 'Author', value: `${author} ([GitHub Repo](${homepage}))`, inline: true }, 
				{ name: 'Deps', value: Object.keys(dependencies).length.toString(), inline: true }
			)
			.setFooter({text:`${client.user.username} · v${version}`})
			.setThumbnail(client.user.avatarURL());
		return interaction.reply({embeds:[embed]});
	},
};
