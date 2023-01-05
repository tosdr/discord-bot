const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType, ActivityFlags } = require('discord.js');
const { token } = require('./config.json');
const log = require('npmlog');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = { client, log };

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
	log.info(`Connected to Discord as ${client.user.username}#${client.user.discriminator} (${client.guilds.cache.size} servers)`);
	client.user.setActivity(`${client.guilds.cache.size} servers`, { type: ActivityType.Watching });
});

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isButton()) {
		if (interaction.customId.startsWith('phoenixPurgeConfirm-')) {
			const command = client.commands.get('phoenix');
			command.execute(interaction, true, interaction.customId.replace('phoenixPurgeConfirm-', ''), 0);
		}
	}
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
		log.info(`User ${interaction.user.username}#${interaction.user.discriminator} executed interaction '${interaction.commandName}'`);
	} catch (error) {
		log.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);
