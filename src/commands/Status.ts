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
      url: 'https://betteruptime.com/api/v2/status-pages/202557/resources',
      headers: {
        'Authorization': `Bearer ${process.env.STATUS_API_KEY}`
      }
    }).then((res) => {
      let embed = buildStatusEmbed(res.data.data);

      return interaction.editReply({ embeds: [embed] })
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
    case "maintainance": return "<:00AAF0:1190014044992720956>"; break;
    case "degraded": return "<:FFA837:1190014041096192171>"; break;
    case "downtime": return "<:C44031:1190014043633758442>"; break;
    default: return "<:9C9C9C:1190014049866490056>"; break;
  }
}

function buildStatusEmbed(resources: any) {
  let content = "";
  resources.forEach((resource: any) => {
    content += `${getStatusEmoji(resource.attributes.status)} ${resource.attributes.public_name}\n`
  })
  return new EmbedBuilder()
    .setTitle(`ToS;DR Status`)
    .setDescription(content)
}
