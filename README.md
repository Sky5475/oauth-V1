# oauth-V1
# Version 1 of Discord bot in slash cds for grabbing oauth members and possibility to reinject them in anyserver you want 
# This is only the part of the client discord then you'll have to dev a little script on an https server in php
with a db to stock members and their informations.

#################################
#                               #
#   Created by Sky  - v1.0.0    #
#                               #
#################################

> DISCLAIMER: I AM NOT RESPONSIBLE FOR ANY ACTION TAKEN AGAINST YOU FOR MISUSE OF THIS TOOL <

Required:
- NodeJS (https://nodejs.org/en/)
- Discord Redirect (https://discord.com/developers/applications)

.env:
=CLIENT_ID - The bot account id
=CLIENT_OAUTH_SECRET - The secret key for OAuth2
=CLIENT_TOKEN - The bot token
=MONGO_URI - The mongoose urL for the database to connect with
=PORT - The port you want the backend server to listen on



Config:
*serverId - The server id to execute commands on
*color - The embed color
*bot_status - The status of the bot (online, idle, dnd, offline)
*verified_role_id - The role id to verify users with
*redirect_url: The authentication url for users to authorize (ex: "http://localhost:3001/api/discord/auth/redirect")
*verification_button_url: The discord OAuth2 url that appears when users click the "verify" button (ex: "https://discord.com/api/oauth2/authorize?client_id=1087485905998188564&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fapi%2Fdiscord%2Fauth%2Fredirect&response_type=code&scope=identify%20guilds.join%20guilds")

How to Use:
1. Run install.bat
2. Config the .env file (.env)
3. Config the configuration file (/storage/config.json)
4. Run the application and enjoy :)
