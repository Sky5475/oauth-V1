const { ActionRowBuilder, StringSelectMenuBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create')
        .setDescription(`Create the verification embed.`)
        .setDefaultMemberPermissions(0),

    async execute(interaction, client, config) {

        await interaction.deferReply();

        let embed = new EmbedBuilder()
            .setAuthor({ name: 'User Verification' })
            .setDescription(`Click the button below to become verified.`)
            .setColor(config.color);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Click Here')
                    .setURL(config.verification_button_url),
            )

        await interaction.deleteReply();
        let msg = await interaction.channel.send({ embeds: [embed], components: [row] });

    }
}
