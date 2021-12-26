import { MessageEmbed } from 'discord.js';
import { ICommand } from 'wokcommands';
import accountDB from '../../../db/accountdb';
import discordDB from '../../../db/discorddb';

export default {
    category: 'SNS',
    description: 'View your account info',
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
            const account = await accountDB.findOne({ username: res.currentAccount })
            const my = new MessageEmbed()
                .setColor("#1877f2")
                .setTitle(`Current account: \`\`${res.currentAccount}\`\``)
                .addField("Following", account.following[0] ? account.following.join(", ") : "None")
                .addField("Follower", account.follower[0] ? account.follower.join(", ") : "None")
                .setFooter('Joined')
                .setTimestamp(account.created);

            interaction.reply({ embeds: [my], ephemeral: true });
        }
    },
} as ICommand;
