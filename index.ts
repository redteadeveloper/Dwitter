import DiscordJS, { Intents } from 'discord.js';
import WOKCommands from 'wokcommands';
import path from 'path';
import 'dotenv/config';

const client = new DiscordJS.Client({
   intents: new Intents(32767),
});

client.on('ready', async () => {
   new WOKCommands(client, {
      commandsDir: path.join(__dirname, 'commands'),
      typeScript: true,
      testServers: ['690837811406045215'],
      botOwners: ['611396886418685982'],
      mongoUri: process.env.MONGODB
   });
});

client.login(process.env.DISCORD);
