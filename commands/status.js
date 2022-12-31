const { SlashCommandBuilder } = require('discord.js');
const { MenuPaginationBuilder } = require("spud.js");
const { buildStatusEmbed, getGroups } = require('../util/functions.js');
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
		const groups = getGroups(response);
		let embeds = [],
			index = 1;
		groups.forEach(group => {
			embeds.push({
				embed: buildStatusEmbed(group.status, index, response.components.length),
				label: `=== ${group.name} ===`,
			})
			index += 1;
			group.components.forEach(component => {
				embeds.push({
					embed: buildStatusEmbed(component, index, response.components.length),
					label: component.name,
				})
				index += 1;
			})
		});

		const pagination = new MenuPaginationBuilder(interaction)
			.setOptions(embeds)
			.replyOption({interaction: true}, true);
		
		pagination.send();
	},
};
