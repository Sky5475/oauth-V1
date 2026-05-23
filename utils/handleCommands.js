const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const config = require('../storage/config.json');

module.exports = (client) => {

  client.handleCommands = async (commandFolders, path) => {

    client.commandArray = [];

    for (folder of commandFolders) {
      const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
      for (const file of commandFiles) {
        const command = require(`../commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
        client.commandArray.push(command.data.toJSON());
        console.log(`[APP] [hooking]`.green + ': ' + `command ${command.data.name} --> loaded`);
      }
    }

    const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

    (async () => {
      try {
        console.log(`[APP] [commands]`.cyan + ': started refreshing application (/) commands');
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, config.serverId), { body: client.commandArray });

        console.log(`[APP] [commands]`.cyan + ': successfully reloaded application (/) commands');
      } catch (error) {
        console.error(error);
      }
    })();

  }
}
