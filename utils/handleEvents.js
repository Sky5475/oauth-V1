const config = require('../storage/config.json');

module.exports = (client) => {

  client.handleEvents = async (eventFiles, path) => {

    for (const file of eventFiles) {
      const event = require(`../events/${file}`);
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client, config));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client, config));
      }
      console.log(`[APP] [hooking]`.green + ': ' + `event (${event.name}) --> binded`);
    }
  }
}
