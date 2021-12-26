import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from 'discord.js';
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

        interaction.reply({ content: "Please wait...", ephemeral: true })

        const account = await accountDB.findOne({ username: interaction.options.getString("username") })
        const my = await discordDB.findOne({ userID: interaction.user.id })
        const myAccount = await accountDB.findOne({ username: my.currentAccount })

        if(account === null) {
            const noUser = new MessageEmbed()
                .setColor("#FF665B")
                .setTitle("No user found");

            interaction.editReply({ content: null, embeds: [noUser]});
        } else {
            const embed = new MessageEmbed()
                .setColor("#1877f2")
                .setTitle(`Username: \`\`${account.username}\`\``)
                .addField("Following", account.following[0] ? account.following.join(", ") : "None")
                .addField("Follower", account.follower[0] ? account.follower.join(", ") : "None")
                .setFooter('Joined')
                .setTimestamp(account.created);

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('follow')
                        .setLabel('Follow')
                        .setStyle('SUCCESS'),
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('unfollow')
                        .setLabel('Unfollow')
                        .setStyle('DANGER'),
                );

            interaction.editReply({ content: null, embeds: [embed], components: [row]});

            const filter = (btnInt: MessageComponentInteraction) => {
                return interaction.user.id === btnInt.user.id;
            };
    
            const collector = channel.createMessageComponentCollector({
                filter,
                max: 1,
                time: 1000 * 30,
            });

            collector.on('collect', async (i: MessageComponentInteraction) => {
                if (i.customId === 'follow') {
                    if (account.follower.includes(my.currentAccount)) {
                        const already = new MessageEmbed()
                            .setColor("#FF665B")
                            .setTitle("Already following");

                        interaction.editReply({ embeds: [already], components: [], });
                        return;
                    } else {
                        await accountDB.findOneAndUpdate({ username: account.username }, { $push: { follower: myAccount.username } })
                        await accountDB.findOneAndUpdate({ username: my.currentAccount }, { $push: { following: account.username } })
    
                        const success = new MessageEmbed()
                            .setColor('#1877f2')
                            .setTitle('Followed')
        
                        interaction.editReply({ embeds: [success], components: [], });
                        return;
                    }
                } else {
                    if (!account.follower.includes(my.currentAccount)) {
                        const not = new MessageEmbed()
                            .setColor("#FF665B")
                            .setTitle("Not following");

                        interaction.editReply({ embeds: [not], components: [], });
                        return;
                    } else {
                        await accountDB.findOneAndUpdate({ username: account.username }, { $pull: { follower: myAccount.username } })
                        await accountDB.findOneAndUpdate({ username: my.currentAccount }, { $pull: { following: account.username } })  
                        
                        const success = new MessageEmbed()
                            .setColor('#1877f2')
                            .setTitle('Unfollowed')
        
                        interaction.editReply({ embeds: [success], components: [], });
                        return;
                    }
                }
            });
    
            collector.on('end', async collection => {
                if (collection.first()?.customId === undefined) {
                    interaction.editReply({
                        embeds: [embed],
                        components: []
                    })
                }    
            });
        }
    },
} as ICommand;
