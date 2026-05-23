const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const Users = require('../../models/users.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pullall')
        .setDescription(`Add all members to a different server.`)
        .addStringOption(option => option.setName('server-id').setDescription('The target server id.').setRequired(true))
        .setDefaultMemberPermissions(0),

    async execute(interaction, client, config) {

        await interaction.deferReply();

        let serverId = interaction.options.get('server-id').value;

        let targetGuild = client.guilds.cache.get(serverId);
        if (!targetGuild) return await interaction.reply({ content: 'Could not find that guild. Make sure the bot is in it!', ephemeral: true });

        let guildMembers = await interaction.guild.members.fetch();

        let processed = [];

        Users.find({}, async (error, users) => {

            let embed = new EmbedBuilder()
                .setTitle(`__Joining Members__`)
                .setDescription(`\`0/${users.length}\` users joined to \`${targetGuild.name}\`\n\`\`\`Adding members...\`\`\``)
                .setColor(config.color);

            await interaction.deleteReply();
            let msg = await interaction.channel.send({ embeds: [embed] });

            for (var i = 0; i < users.length; i++) {

                let username = await interaction.guild.members.cache.get(users[i].userId).user.username;

                try {

                    const joiner = await axios.put(`https://discord.com/api/guilds/${targetGuild.id}/members/${users[i].userId}`, { access_token: users[i].access_token }, { headers: { 'Authorization': `Bot ${process.env.CLIENT_TOKEN}`, "Content-Type": "application/json" } });
                    processed.push(`[+] Joined ${username}`);
                    embed.setDescription(`\`${i + 1}/${users.length}\` users joined to \`${targetGuild.name}\`\n\`\`\`${processed.join('\n')}\`\`\``);
                    await msg.edit({ embeds: [embed] });
                    await wait();

                } catch (err) {

                    console.log(err);
                }

            }
        })

    }
}

// Wait Function
async function wait() {
    let ms = Math.random() * (3000 - 1000) + 1000;
    return new Promise(resolve => setTimeout(resolve, ms));
}
/////////////////////////////////////////////////////////////
