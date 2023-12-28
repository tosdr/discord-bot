import { CommandInteraction, Client, ApplicationCommandType, ChatInputCommandInteraction, EmbedBuilder, Colors, Embed } from "discord.js";
import { Command } from "../Command";
import axios from "axios";
import logger from "../utils/logger";
import { Pagination } from "pagination.djs";

export const Status: Command = {
  name: "status",
  description: "Shows the current server status.",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: ChatInputCommandInteraction) => {
    axios.request({
      method: 'GET',
      url: 'https://status.tosdr.org/api/v2/summary.json'
    }).then((res) => {
      const groups = getGroups(res.data);
      let embeds: EmbedBuilder[] = [],
        index = 1;
      groups.forEach(group => {
        embeds.push(buildGroupStatusEmbed(group, index, groups.length))
        index++;
      });

      const pagination = new Pagination(interaction);
      pagination.setEmbeds(embeds);
      return pagination.render();
    }).catch((err) => {
      logger.error(err)
      const error_embed = new EmbedBuilder()
        .setTitle("An error occurred while executing the comamnd!")
        .setDescription(`\`\`\`\n${err.message}\n\`\`\``)
        .setColor(Colors.Red);
      return interaction.editReply({ embeds: [error_embed] });
    });
  },
};

function getStatusEmoji(status_string: string) {
  switch (status_string) {
    case "operational": return "<:27AE60:1190014048230707200>"; break;
    case "under_maintainance": return "<:00AAF0:1190014044992720956>"; break;
    case "degraded_performance":
    case "partial_outage": return "<:FFA837:1190014041096192171>"; break;
    case "major_outage": return "<:C44031:1190014043633758442>"; break;
    default: return "<:9C9C9C:1190014049866490056>"; break;
  }
}

function groupExists(groupId: string, existingGroups: any) {
  let index = 0;
  let response;
  for (const group of existingGroups) {
    if (group.id == groupId) { response = { "exists": true, "index": index }; }
    index += 1;
  }
  if (response != undefined) return response;
  return { "exists": false, "index": -1 };
}

function getGroups(response: any) {
  const components = response.components;
  let responseGroups: any[] = [],
    groups = [];

  for (const component of components) {
    if (!component.group) {
      let group = groupExists(component.group_id, groups);
      if (group.exists) {
        groups[group.index].components.push(component);
      } else {
        groups.push({
          "id": component.group_id,
          "name": null,
          "components": [component],
          "status": null
        });
      }
    } else responseGroups.push(component);
  }

  groups.forEach(group => {
    responseGroups.forEach(responseGroup => {
      if (group.id == responseGroup.id) {
        group.name = responseGroup.name;
        group.status = responseGroup;
      }
    });
  });

  return groups;
}

function buildGroupStatusEmbed(group: any, index: number, total: number) {
  let content = "";
  group.components.forEach((component: any) => {
    content += `${getStatusEmoji(component.status)} ${component.name}\n`
  })
  return new EmbedBuilder()
    .setTitle(`${group.name} Status`)
    .setDescription(content)
    .setFooter({ text: `Page ${index}/${total}` });
}
