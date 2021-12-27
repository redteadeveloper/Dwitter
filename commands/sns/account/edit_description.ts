import {
    MessageEmbed,
} from 'discord.js';
import { ICommand } from 'wokcommands';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import accountDB from '../../../db/accountdb';
import discordDB from '../../../db/discorddb';
import { loginCheck } from '../../../modules/tools';

export default {
    category: 'SNS',
    description: 'Change account description',
    slash: true,
    testOnly: true,
    options: [
        {
            name: 'description',
            description: 'Account description',
            required: true,
            type: ApplicationCommandOptionTypes.STRING,
        },
    ],

    callback: async ({ interaction, channel }) => {

        if (await loginCheck(interaction.user.id) === false) {
            const noUser = new MessageEmbed()
                .setColor("#FF665B")
                .setTitle("Not logged in");

            return interaction.reply({ embeds: [noUser], ephemeral: true });
        } else if (interaction.options.getString("description", true).length > 150) {
            const long = new MessageEmbed()
                .setColor("#FF665B")
                .setTitle("Display name must be 150 characters or fewer");

            return interaction.reply({ embeds: [long], ephemeral: true });
        } else {
            const current = await discordDB.findOne({ userID: interaction.user.id });
            await accountDB.findOneAndUpdate({ username: current.currentAccount }, { description: interaction.options.getString("description") });

            const success = new MessageEmbed()
                .setColor("#1877f2")
                .setTitle("Success!");

            interaction.reply({ embeds: [success] });
        }
    },
} as ICommand;
