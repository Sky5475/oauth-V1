const { SlashCommandBuilder } = require('@discordjs/builders');

const Users = require('../../models/users.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription(`Reset the database.`)
        .setDefaultMemberPermissions(0),

    async execute(interaction, client, config) {

        Users.deleteMany({}, async (error, users) => {

            await interaction.reply({ content: 'Reset database successfully!', ephemeral: true });
        })

    }
}
