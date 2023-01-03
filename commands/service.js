const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder } = require('discord.js');
const { Pagination } = require('pagination.djs');
const fetch = require('node-fetch-commonjs');
const { embedColor } = require('../config.json');
const log = require('npmlog');
const { buildServiceEmbed } = require('../util/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('service')
		.setDescription('Searches for services based on a query.')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('The query to seach for')
				.setRequired(true)),
	async execute(interaction) {
		const query = interaction.options.getString('query');
		const response = await fetch(`https://api.tosdr.org/search/v4/?query=${query}`, {method: 'GET'})
			.then(res => res.json())
			.catch(err => log.error('fetch error:' + err));
		const services = response.parameters.services;
		if (services.length == 0) return interaction.reply("No results!");

		const pagination = new Pagination(interaction);
		let embeds = [], index = 1;
		for(const service of services) {
			embeds.push(buildServiceEmbed(service, embedColor, index, services.length));
			index++;
		}

		pagination.setEmbeds(embeds);
		pagination.render(); // Render and send embed(s)
	},
};
