// Created by Medi :)
const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });
client.commands = new Collection();
const mongoose = require('mongoose');

const Users = require('./models/users.js');
const config = require('./storage/config.json');

const colors = require('colors');
const fs = require('fs');
const url = require('url');
const axios = require('axios');
const express = require('express');
const PORT = process.env.PORT || 3001;
const server = express();
require('dotenv').config();
////////////////////////////////////////////////////////////////////////////////

console.clear();
console.log('\nInitiating login...'.magenta);

// Server Api (OAuth2)
server.get('/api/discord/auth/redirect', async (req, res) => {

    const { code } = req.query;

    if (code) {

        try {

            const formData = new url.URLSearchParams({ 'client_id': process.env.CLIENT_ID, 'client_secret': process.env.CLIENT_OAUTH_SECRET, 'grant_type': 'authorization_code', 'code': code, 'redirect_uri': config.redirect_url });

            const response = await axios.post('https://discord.com/api/v10/oauth2/token', formData.toString(), {}, headers = { 'Content-Type': 'application/x-www-form-urlencoded' });

            const { access_token, refresh_token } = response.data;
            const { data: user } = await axios.get('https://discord.com/api/v10/users/@me', { headers: { 'Authorization': `Bearer ${access_token}` } });

            Users.findOne({ userId: user.id }, async (error, dbuser) => {

                let guildMembers = await client.guilds.cache.get(config.serverId).members.fetch();
                let verified_role = client.guilds.cache.find(g => g.id === config.serverId).roles.cache.find(r => r.id === config.verified_role_id);

                if (!verified_role) {
                    res.sendStatus(400);
                    return console.log(`[ERROR] The verified role has not been setup yet!`.red);
                }

                if (dbuser) {

                    dbuser.access_token = access_token;
                    dbuser.refresh_token = refresh_token;
                    await dbuser.save();

                    let member = client.guilds.cache.get(config.serverId).members.cache.get(user.id);
                    await member.roles.add(verified_role.id);

                    res.sendStatus(200);
                    return;
                }

                const nUser = new Users({ userId: user.id, access_token: access_token, refresh_token: refresh_token });
                await nUser.save();

                let member = client.guilds.cache.get(config.serverId).members.cache.get(user.id);
                await member.roles.add(verified_role.id);
                res.sendStatus(200);
            })


        } catch (error) {
            console.log(error);
            res.send(400);
        }
    }
})

process.on('uncaughtException', function (error) {
    console.log(`[CAUGHT ERROR] ${error.stack}`);
});
////////////////////////////////////////////////////////////////////////////////

const functions = fs.readdirSync("./utils").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./commands");
////////////////////////////////////////////////////////////////////////////////

for (file of functions) {
    require(`./utils/${file}`)(client);
}
client.handleCommands(commandFolders, "./commands");
client.handleEvents(eventFiles, "./events");
////////////////////////////////////////////////////////////////////////////////

server.listen(PORT, async () => {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.login(process.env.CLIENT_TOKEN);
    console.log(`Server Enabled - Listening on port: ${PORT}`.green);
});

////////////////////////////////////////////////////////////////////////////////////