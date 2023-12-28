import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import logger from "./utils/logger";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";

logger.info("Booting up...");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

// Register listeners
ready(client);
interactionCreate(client);

client.login(process.env.DISCORD_TOKEN)
