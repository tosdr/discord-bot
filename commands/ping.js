const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const { client } = require("../bot.js");
		return interaction.reply(`:ping_pong: Pong! **${client.ws.ping}ms**`);
	},
};
