import { MessageEmbed } from 'discord.js';
import { ICommand } from 'wokcommands';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import accountDB from '../../../db/accountdb';
import discordDB from '../../../db/discorddb';
import postDB from '../../../db/postdb';
import notifDB from '../../../db/notifdb';
import { loginCheck, currentAccount } from '../../../modules/tools';

export default {
    category: 'SNS',
    description: 'Create a post',
    slash: true,
    testOnly: true,
    options: [
        {
            name: 'title',
            description: 'Post title',
            required: true,
            type: ApplicationCommandOptionTypes.STRING,
        },
        {
            name: 'content',
            description: 'Post content',
            required: true,
            type: ApplicationCommandOptionTypes.STRING,
        },
    ],

    callback: async ({ interaction, channel }) => {

        if (await loginCheck(interaction.user.id) === false) {
            const noLogin = new MessageEmbed()
                .setColor("#FF665B")
                .setTitle("Not logged in")
                .setDescription('Use ``/login`` command to log in');

            interaction.reply({ embeds: [noLogin], ephemeral: true });
            return;
        }

        if (interaction.options.getString('title', true).length > 70) {
            const embed = new MessageEmbed()
                .setColor("#FF665B")
                .setTitle("Title length limit exceeded")
                .setDescription("Title must be shorter than 70 characters.")

            interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        if (interaction.options.getString('content', true).length > 140) {
            const embed = new MessageEmbed()
                .setColor("#FF665B")
                .setTitle("Content length limit exceeded")
                .setDescription("Content must be shorter than 140 characters.")

            interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        await new postDB({
            userID: interaction.user.id,
            username: await currentAccount(interaction.user.id),
            created: interaction.createdAt,
            title: interaction.options.getString("title"),
            content: interaction.options.getString("content"),
            like: [],
            comment: [],
        }).save()

        await new notifDB({
            from: await currentAccount(interaction.user.id),
            target: (await accountDB.findOne({ username: await currentAccount(interaction.user.id) })).follower,
            content: `${await currentAccount(interaction.user.id)} posted a new post!`,
            read: [],
        }).save()

        const embed = new MessageEmbed()
            .setColor("#1877f2")
            .setTitle("Success!")
            .setDescription("Successfully created a new post")

        interaction.reply({ embeds: [embed], ephemeral: true });
    },
} as ICommand;
