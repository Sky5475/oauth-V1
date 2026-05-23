const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const Users = require('../../models/users.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription(`Add a member to a server.`)
        .addUserOption(option => option.setName('member').setDescription('The member to pull.').setRequired(true))
        .addStringOption(option => option.setName('server-id').setDescription('The target server id.').setRequired(true))
        .setDefaultMemberPermissions(0),

    async execute(interaction, client, config) {

        let member = interaction.options.get('member');
        let serverId = interaction.options.get('server-id').value;

        Users.findOne({ userId: member.user.id }, async (error, user) => {

            if (!user) return await interaction.reply({ content: 'No access token could be found for that member!', ephemeral: true });

            // Fetch all members, check if member is already in the target server [TO-DO]

            let targetGuild = client.guilds.cache.get(serverId);
            if (!targetGuild) return await interaction.reply({ content: 'Could not find that guild. Make sure the bot is in it!', ephemeral: true });

            // Not caching when bot is switched on/off [TO-DO]
            let checkMember = await targetGuild.members.cache.get(member.user.id);
            if (checkMember) return await interaction.reply({ content: 'That member is already in the target server!', ephemeral: true });

            try {

                const { data: newMemberData } = await axios.put(`https://discord.com/api/guilds/${targetGuild.id}/members/${member.user.id}`, { access_token: user.access_token }, { headers: { 'Authorization': `Bot ${process.env.CLIENT_TOKEN}`, "Content-Type": "application/json" } });
                let embed = new EmbedBuilder()
                    .setDescription(`:white_check_mark: ${member.user} has been added to **${targetGuild.name}**`)
                    .setColor(config.color);

                await interaction.reply({ embeds: [embed], ephemeral: false });

            } catch (err) {

                console.log(err);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                return;
            }

        })

    }
}
