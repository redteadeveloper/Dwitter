import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from 'discord.js';
import { ICommand } from 'wokcommands';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import accountDB from '../../../db/accountdb';
import discordDB from '../../../db/discorddb';

export default {
    category: 'SNS',
    description: 'View a user\'s posts',
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

        await interaction.reply({ content: "Please wait...", ephemeral: true })

        const account = await accountDB.findOne({ username: interaction.options.getString("username") });

        if(!account) {
            const embed = new MessageEmbed()
                .setColor("#FF665B")
                .setTitle("No user found");

            interaction.editReply({ embeds: [embed] });
            return;
        }

        const posts = account.posts;

        posts.sort((a: { created: Date; }, b: { created: Date; }) => (a.created > b.created) ? -1 : ((a.created < b.created) ? 1 : 0));

        function generatePostEmbed(n: number) {
            const embed = new MessageEmbed()
                .setColor("#1877f2")
                .setAuthor(`${account.displayname} / @${interaction.options.getString("username")}`)
                .setTitle(posts[n].title)
                .setDescription(posts[n].content)
                .setFooter(`${n+1}/${posts.length}`)
                .setTimestamp(posts[n].created);

            return embed
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('prev')
                    .setLabel('◀')
                    .setStyle('SUCCESS'),
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('next')
                    .setLabel('▶')
                    .setStyle('SUCCESS'),
            );

        const filter = (btnInt: MessageComponentInteraction) => {
            return interaction.user.id === btnInt.user.id;
        };

        const collector = channel.createMessageComponentCollector({
            filter,
            time: 1000 * 120,
        });

        let currentPage = 0

        interaction.editReply({ content: null, components: [row], embeds: [generatePostEmbed(0)] });

        collector.on('collect', (i: MessageComponentInteraction) => {
            if (i.customId === 'prev') {
                if (currentPage === 0) {
                    currentPage = posts.length - 1;
                } else {
                    currentPage -= 1;
                }

                i.update({
                    embeds: [generatePostEmbed(currentPage)],
                });
            } else {
                if (currentPage === posts.length - 1) {
                    currentPage = 0;
                } else {
                    currentPage += 1;
                }

                i.update({
                    embeds: [generatePostEmbed(currentPage)],
                });
            }
        });

        collector.on('end', async => {
            interaction.editReply({ embeds: [generatePostEmbed(currentPage)], components: [] })
        });
        
    },
} as ICommand;
