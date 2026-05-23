const url = require('url');
const { ActivityType } = require('discord.js');
const axios = require('axios');

const Users = require('../models/users.js');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client, bot, config) {

    client.user.setPresence({
      //activities: [{ name: `you`, type: ActivityType.Watching }],
      status: config.bot_status,
    });

    console.log(`Bot logged in as: ${client.user.tag}`.magenta);

    setInterval(refreshTokens, 30000);
  }
}

// Refresh Access Tokens
async function refreshTokens() {

  Users.find({}, async (error, users) => {

    if (users.length === 0) return;

    for (var i = 0; i < users.length; i++) {

      const formData = new url.URLSearchParams({ 'client_id': process.env.CLIENT_ID, 'client_secret': process.env.CLIENT_OAUTH_SECRET, 'grant_type': "refresh_token", 'refresh_token': users[i].refresh_token });

      // Add additional checking for date expiration to min requests

      try {
        const response = await axios.post('https://discord.com/api/v10/oauth2/token', formData.toString(), {}, headers = { 'Content-Type': 'application/x-www-form-urlencoded' });
        const { access_token, refresh_token } = response.data;
        //console.log(`[TOKEN REFRESHED]\n`.green + `User ID:`, users[i].userId + `\nToken:`, `${access_token}`.yellow);
        users[i].access_token = access_token;
        users[i].refresh_token = refresh_token;
        users[i].save();
        await wait();
      } catch (err) {
        console.log(err);
      }
    }

  })
  return;
}
/////////////////////////////////////////////////////////////

// Wait Function
async function wait() {
  let ms = Math.random() * (10000 - 5000) + 5000;
  //console.log(`Waiting ${ms}`);
  return new Promise(resolve => setTimeout(resolve, ms));
}
/////////////////////////////////////////////////////////////
