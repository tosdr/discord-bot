import { ActivityType, Client } from "discord.js";
import logger from "../utils/logger";
import { Commands } from "../Commands";

export default (client: Client): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }

    await client.application.commands.set(Commands);
    logger.info(`Registered ${Commands.length} application commands`);

    client.user.setPresence({
      activities: [
        {
          name: "Reading the TOS",
          type: ActivityType.Custom,
        },
      ],
      status: "online",
    });

    logger.info(`Logged in as ${client.user.username}`);
  });
};
