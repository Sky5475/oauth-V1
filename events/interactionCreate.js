const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const config = require('../storage/config.json');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client, config) {

    if (interaction.isCommand()) {

      const command = client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction, client, config);
      } catch (error) {
        console.log(error);
        await interaction.reply({ content: `There was an error while executing this command!` });
      }

      return;
    }

  }
}
