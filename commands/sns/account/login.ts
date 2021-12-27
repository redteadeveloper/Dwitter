import { MessageEmbed } from 'discord.js';
import { ICommand } from 'wokcommands';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import accountDB from '../../../db/accountdb';
import discordDB from '../../../db/discorddb';

export default {
    category: 'SNS',
    description: 'Login into Dwitter',
    slash: true,
    testOnly: true,
    options: [
        {
            name: 'username',
            description: 'Account username',
            required: true,
            type: ApplicationCommandOptionTypes.STRING,
        },
        {
            name: 'password',
            description: 'Account password',
            required: true,
            type: ApplicationCommandOptionTypes.STRING,
        },
    ],

    callback: async ({ interaction, channel }) => {

        const res = await accountDB.findOne({ username: interaction.options.getString("username") });

        if (!res) {
            const noUser = new MessageEmbed()
                .setColor("#FF665B")
                .setTitle("No user found");

            interaction.reply({ embeds: [noUser], ephemeral: true });
        } else if (res.password != interaction.options.getString("password")) {
            const wrongPass = new MessageEmbed()
                .setColor("#FF665B")
                .setTitle("Wrong password");

            interaction.reply({ embeds: [wrongPass], ephemeral: true });
        } else {
            const success = new MessageEmbed()
                .setColor("#1877f2")
                .setTitle("Success!")
                .setDescription(`Logged in as: \`\`${interaction.options.getString("username")}\`\``);

            interaction.reply({ embeds: [success], ephemeral: true });

            await accountDB.updateOne({ username: interaction.options.getString("username") }, { login: true });
            await discordDB.updateOne({ userID: interaction.user.id }, { currentAccount: interaction.options.getString("username") });
        }
    },
} as ICommand;
