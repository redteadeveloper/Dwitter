import { MessageEmbed } from 'discord.js';
import { ICommand } from 'wokcommands';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import accountDB from '../../../db/accountdb';
import discordDB from '../../../db/discorddb';

export default {
    category: 'SNS',
    description: 'Login into CordBook',
    slash: true,
    testOnly: true,
    options: [
        {
            name: 'username',
            description: 'Account username',
            required: true,
            type: ApplicationCommandOptionTypes.STRING,
        },
    ],

    callback: async ({ interaction, channel }) => {

        
    },
} as ICommand;
