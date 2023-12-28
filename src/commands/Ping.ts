import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "../Command";

export const Ping: Command = {
  name: "ping",
  description: "Returns gateway ping",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    const content = `:ping_pong: Pong! **${client.ws.ping}ms**`;

    await interaction.followUp({
      ephemeral: false,
      content,
    });
  },
};
