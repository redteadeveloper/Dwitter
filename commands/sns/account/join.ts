import {
    MessageActionRow,
    MessageButton,
    MessageComponentInteraction,
    MessageEmbed,
} from 'discord.js';
import { ICommand } from 'wokcommands';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import accountDB from '../../../db/accountdb';
import discordDB from '../../../db/discorddb';

export default {
    category: 'SNS',
    description: 'Create an account',
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

        if(interaction.options.getString("username")?.match(/^[a-z0-9]+$/i) === null) {
            const embed = new MessageEmbed()
                .setColor('#FF665B')
                .setTitle('Invalid username')
                .setDescription('Username must be alphanumeric')
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }

        const resUsername = await accountDB.findOne({ username: interaction.options.getString("username") })
        if(resUsername) {
            const embed = new MessageEmbed()
                .setColor('#FF665B')
                .setTitle('Username already taken')
                .setDescription('Choose a different username')
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }

        const confirm = new MessageEmbed()
            .setColor("#1877f2")
            .setTitle("Confirm?")
            .setDescription(
                `Username: ||\`\`${interaction.options.getString('username')}\`\`||
                Password: ||\`\`${interaction.options.getString('password')}\`\`||`
            );

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('yes')
                    .setLabel('Yes')
                    .setStyle('SUCCESS'),
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('no')
                    .setLabel('No')
                    .setStyle('DANGER'),
            );

        interaction.reply({
            embeds: [confirm],
            components: [row],
            ephemeral: true,
        });

        const filter = (btnInt: MessageComponentInteraction) => {
            return interaction.user.id === btnInt.user.id;
        };

        const collector = channel.createMessageComponentCollector({
            filter,
            max: 1,
            time: 1000 * 10,
        });

        collector.on('collect', (i: MessageComponentInteraction) => {
            if (i.customId === 'yes') {
                setTimeout(async () => {
                    await new accountDB({
                        userID: interaction.user.id,
                        created: interaction.createdAt,
                        username: interaction.options.getString('username'),
                        password: interaction.options.getString('password'),
                        login: false,
                        posts: [],
                        friend: [],
                        follower: [],
                        following: [],
                    }).save();

                    if (!(await discordDB.findOne({ userID: interaction.user.id }))) {
                        await new discordDB({
                            userID: `${interaction.user.id}`,
                            currentAccount: null,
                        }).save();
                    }
                }, 1000);

                const yesembed = new MessageEmbed()
                    .setColor('#1877f2')
                    .setTitle('Joined!')
                    .setDescription('Use ``/login`` command to log in')

                i.update({
                    embeds: [yesembed],
                    components: [],
                });
            } else {
                const noembed = new MessageEmbed()
                    .setColor('#FF665B')
                    .setTitle('Cancelled')

                i.update({
                    embeds: [noembed],
                    components: [],
                });
            }
        });

        collector.on('end', async collection => {
            if (collection.first()?.customId === undefined) {
                const timeoutembed = new MessageEmbed()
                    .setColor('#FF665B')
                    .setTitle('Timeout')
                    .setDescription('Please try again.')
                await interaction.editReply({
                    embeds: [timeoutembed],
                    components: [],
                });
            }
        });
    },
} as ICommand;
