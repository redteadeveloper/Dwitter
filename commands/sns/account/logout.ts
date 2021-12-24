import { MessageEmbed } from 'discord.js';
import { ICommand } from 'wokcommands';
import accountDB from '../../../db/accountdb';
import discordDB from '../../../db/discorddb';

export default {
    category: 'SNS',
    description: 'Log out from account.',
    slash: true,
    testOnly: true,

    callback: async ({ interaction, channel }) => {

        const res = await discordDB.findOne({ userID: interaction.user.id });

        if (res.currentAccount === null) {
            const noUser = new MessageEmbed()
                .setColor("#FF665B")
                .setTitle("Not logged in");

            interaction.reply({ embeds: [noUser], ephemeral: true });
        } else {
            const success = new MessageEmbed()
                .setColor("#1877f2")
                .setTitle("Success!")
                .setDescription(`Successfully logged out`);

            interaction.reply({ embeds: [success], ephemeral: true });

            await accountDB.updateOne({ username: res.currentAccount }, { login: false });
            await discordDB.updateOne({ userID: interaction.user.id }, { currentAccount: null});
        }
    },
} as ICommand;
