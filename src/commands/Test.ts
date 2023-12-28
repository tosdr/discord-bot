import { CommandInteraction, Client, ApplicationCommandType, Collection, Message, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import logger from "../utils/logger";

export const Test: Command = {
  name: "test",
  description: "Test command",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "purge",
      description: "Purges all Phoenix comments from the specified user.",
      type: ApplicationCommandOptionType.Subcommand,
    }
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    if (interaction.channel == null) return await interaction.followUp("This command cannot be run in DMs!");

    await interaction.followUp({
      ephemeral: false,
      content: "Type \"Confirm\" to do the thing",
    });

    const filter = (m: Message) =>
      m.content.toLowerCase() === 'confirm' &&
      m.author.id === interaction.user.id;

    const collector = interaction.channel.createMessageCollector({
      filter,
      max: 1,
      time: 10000
    });

    collector.on('collect', async (m: Message) => {
      if (m.deletable) m.delete();
      interaction.editReply("Doing the thing");
    });

    collector.on('end', (collected: any, reason: any) => {
      if (reason === 'time') {
        interaction.editReply("Timed out, no actions performed")
      }
    });
  },
};
