const { SlashCommandBuilder } = require('discord.js');
const { MenuPaginationBuilder } = require("spud.js");
const { buildStatusEmbed } = require('../util/functions.js');
const Fetch = require('node-fetch-commonjs');
const log = require('npmlog');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Shows the current server status.'),
	async execute(interaction) {
		const response = await Fetch('https://status.tosdr.org/api/v2/summary.json', {method: 'GET'})
		.then(res => res.json())
		.catch(err => log.error(err));
		let embeds = [],
			index = 1;
		response.components.forEach(component => { if (!component.group) {
			// Menu item limit is 25
			if (index < 25) embeds.push({
				embed: buildStatusEmbed(component, index, response.components.length),
				label: component.name,
				sort: component.group_id
			});
			console.log(component.group_id)
			index++;
		}})

		const pagination = new MenuPaginationBuilder(interaction)
			.setOptions(embeds)
			.replyOption({interaction: true}, true);
		
		pagination.send();
	},
};
