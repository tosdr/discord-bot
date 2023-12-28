import { EmbedBuilder, Colors } from "discord.js";

function buildErrorEmbed(message: string) {
  return new EmbedBuilder()
    .setTitle("An error occurred while executing the comamnd!")
    .setDescription(`\`\`\`\n${message}\n\`\`\``)
    .setColor(Colors.Red);
}

export {
  buildErrorEmbed
}
