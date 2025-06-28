const { Client, GatewayIntentBits } = require('discord.js');
const {
  TOKEN, SERVER_ID, CHANNEL_ID, MENTION, TARGET_IDS
} = require('./config.json');

// オフライン通知メッセージIDをユーザーごとに保存しておく
const sentMessages = new Map();

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
  if (TARGET_IDS.some(id => newPresence.userId === id)) {
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (newPresence.status === "offline") {
      if (channel) {
        channel.send(`⚠️ <@&${MENTION}> <@${newPresence.userId}> がオフラインになりました！`)
          .then(msg => {
            sentMessages.set(newPresence.userId, msg.id);
          })
          .catch(err => {
            console.error(`メッセージ送信失敗: ${err}`);
          });
      }
    } else if (newPresence.status === "online") {
      // オンラインになったらメッセージ削除
      const messageId = sentMessages.get(newPresence.userId);
      if (channel && messageId) {
        channel.messages.fetch(messageId)
          .then(msg => msg.delete()
            .catch(err => {
              console.error(`メッセージ削除失敗: ${err}`);
            }))
          .catch(err => {
            console.error(`メッセージ取得失敗: ${err}`);
          });
        sentMessages.delete(newPresence.userId);
      }
    }
  }
});

client.login(TOKEN);
