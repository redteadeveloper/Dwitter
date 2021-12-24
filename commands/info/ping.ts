import { ICommand } from 'wokcommands';

export default {
   category: 'Info',
   description: 'Latency',
   slash: true,
   testOnly: true,

   callback: ({ interaction, client }) => {
      interaction.reply(`:ping_pong: Ping: ${client.ws.ping}ms!`);
   },
} as ICommand;
