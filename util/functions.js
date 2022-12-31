const { EmbedBuilder } = require('discord.js');

module.exports = {
	buildStatusEmbed,
	buildServiceEmbed,
	getRegionFlag
}

function getStatusString(status_string) {
	let status, embedColor;
	switch (status_string) {
		case "operational": status = "Operational"; embedColor = "#27AE60";break;
		case "under_maintainance": status = "Under Maintainance"; embedColor = "#00AAF0"; break;
		case "degraded_performance": status = "Degraded Performance"; embedColor = "#FFA837"; break;
		case "partial_outage": status = "Partial Outage"; embedColor = "#FFA837"; break;
		case "major_outage": status = "Major Outage"; embedColor = "#C44031"; break;
		default: status = "Unknown"; embedColor = "#9C9C9C"; break;
	}

	return {
		message: status,
		embedColor: embedColor
	};
}

function buildServiceEmbed(service, embed_color, index) {
	return new EmbedBuilder()
		.setColor(embed_color)
		.setFooter({text:`Result ${index}/${services.length}`})
		.setImage(service.links.crisp.badge.png)
		.setThumbnail(`https://s3.tosdr.org/logos/${service.id}.png`)
		.setTitle(service.name)
		.setFields(
			{ name: 'ID', value: `${service.id}`, inline: true },
			{ name: 'Links', value: `[Crisp](${service.links.crisp.service}), [Phoenix](${service.links.phoenix.service}), [Docs](${service.links.phoenix.documents}), [Edit](${service.links.phoenix.edit})`, inline: true },
			{ name: 'Rating', value: service.rating.human, inline: true },
			{ name: 'Reviewed?', value: service.is_comprehensively_reviewed ? 'Yes': 'No', inline: true },
			{ name: 'Last Updated', value: new Date(service.updated_at).toISOString().replace(/T/, ' ').replace(/\..+/, ''), inline: true },
			{ name: 'Created', value: new Date(service.created_at).toISOString().replace(/T/, ' ').replace(/\..+/, ''), inline: true }
		);
}

function buildStatusEmbed(component, index, component_count) {
	let status = getStatusString(component.status),
		createdTime = new Date(component.created_at), 
		updatedTime = new Date(component.updated_at);

	return new EmbedBuilder()
		.setColor(status.embedColor)
		.setFooter({text: `Service ${index} of ${component_count} · Status provided by Atlassian Statuspage`})
		.setTitle(component.name)
		.setDescription(component.description)
		.setFields(
			{ name: 'Created', value: `<t:${Math.floor(createdTime.getTime()/1000)}:f>`, inline: true },
			{ name: 'Updated', value: `<t:${Math.floor(updatedTime.getTime()/1000)}:f>`, inline: true },
			{ name: 'Status', value: status.message, inline: true },
		);
}

function getRegionFlag(regionCode) {
	switch (regionCode) {
		case 'us-east':
			return '🇺🇸';
		case 'eu-central':
			return '🇩🇪';
		case 'eu-west':
			return '🇬🇧';
	}
}
