import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, Colors, Embed } from "discord.js";
import { Command } from "../Command";
import logger from "../utils/logger";
import axios from "axios";
import { Pagination } from "pagination.djs";
import { buildErrorEmbed } from "../utils/common";

export const Search: Command = {
  name: "search",
  description: "Search ToS;DR",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "services",
      description: "Search for the specified service",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "query",
          description: "The query to search for",
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    }
  ],
  run: async (client: Client, interaction: ChatInputCommandInteraction) => {
    switch (interaction.options.getSubcommand()) {
      case "services":
        const query = interaction.options.getString("query");
        axios.request({
          method: 'GET',
          url: 'https://api.tosdr.org/search/v4/',
          params: { 'query': query }
        }).then((res) => {
          if (!(res.data.error & 0x100)) {
            logger.error(res.data.message);
            return interaction.editReply({ embeds: [buildErrorEmbed(res.data.message)] });
          }
          const services = res.data.parameters.services;
          if (services.length === 0) {
            throw new Error("No results!");
          }
          const pagination = new Pagination(interaction);
          let embeds = [];
          let index = 1;
          for (const service of services) {
            embeds.push(buildServiceEmbed(service, index, services.length));
            index += 1;
          }
          pagination.setEmbeds(embeds);
          return pagination.render();
        }).catch((err: Error) => {
          logger.error(err)
          return interaction.editReply({ embeds: [buildErrorEmbed(err.message)] });
        })
      default:
        return;
    }
  },
};

function buildServiceEmbed(service: any, index: number, total: number) {
  return new EmbedBuilder()
    .setTitle(service.name)
    .setFields([
      {
        name: "ID",
        value: `${service.id}`,
        inline: true,
      },
      {
        name: "Links",
        value: `[Crisp](${service.links.crisp.service}), [Phoenix](${service.links.phoenix.service}), [Docs](${service.links.phoenix.documents}), [Edit](${service.links.phoenix.edit})`,
        inline: true,
      },
      {
        name: "Rating",
        value: service.rating.human,
        inline: true,
      },
      {
        name: "Reviewed?",
        value: service.is_comprehensively_reviewed ? 'Yes' : 'No',
        inline: true,
      },
      {
        name: "Last Updated",
        value: `<t:${Math.floor(new Date(service.updated_at).valueOf() / 1000)}:f>`,
        inline: true,
      },
      {
        name: "Created",
        value: `<t:${Math.floor(new Date(service.created_at).valueOf() / 1000)}:f>`,
        inline: true,
      }
    ])
    .setThumbnail(`https://s3.tosdr.org/logos/${service.id}.png`)
    .setImage(service.links.crisp.badge.png)
    .setFooter({ text: `Result ${index}/${total}` })
    .setColor(Colors.Blue);
}
