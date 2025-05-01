const { Client, GatewayIntentBits } = require('discord.js');
const {
  TOKEN, SERVER_ID, CHANNEL_ID, MENTION, TARGET_IDS
} = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences
  ]
});

client.once('ready', () => {
  console.log("Bot is online!");
});

client.on('presenceUpdate', (_, newPresence) => {
  if(TARGET_IDS.some(id => newPresence.userId === id)) {
    const channel = client.channels.cache.get(CHANNEL_ID);
    if(newPresence.status === "offline"){
      if (channel) channel.send(`⚠️ <@&${MENTION}> <@${newPresence.userId}> がオフラインになりました！`);
    }


  }
});

client.login(TOKEN);
