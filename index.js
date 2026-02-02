const { Client, GatewayIntentBits, ApplicationCommandOptionType } = require('discord.js');

const {
  TOKEN, SERVER_ID, CHANNEL_ID, MENTION, TARGET_IDS
} = require('./config.json');

// オフライン情報をユーザーごとに保存しておく
const offlineData = new Map();
let mute_data = null;

const commands = [
  {
    name: "mute",
    description: "指定された時間、状態をメンションしません",
    options: [
      {
        type: ApplicationCommandOptionType.Integer,
        name: "time",
        description: "時間（分）",
        required: true
      },
      {
        type: ApplicationCommandOptionType.String,
        name: "reason",
        description: "理由",
        required: true
      }
    ]    
  }
]

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences
  ]
});

function formatDate(date) {
  const y = date.getFullYear();
  const M = (`0${date.getMonth() + 1}`).slice(-2);
  const d = (`0${date.getDate()}`).slice(-2);
  const h = (`0${date.getHours()}`).slice(-2);
  const m = (`0${date.getMinutes()}`).slice(-2);
  const s = (`0${date.getSeconds()}`).slice(-2);
  return `${y}/${M}/${d} ${h}:${m}:${s}`;
}

function formatDuration(milliseconds) {
  if (milliseconds < 0) milliseconds = 0;

  const totalSeconds = Math.floor(milliseconds / 1000);
  let days = Math.floor(totalSeconds / 86400);
  let hours = Math.floor((totalSeconds % 86400) / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;

  let parts = [];
  if (days > 0) parts.push(days + '日');
  if (hours > 0) parts.push(hours + '時間');
  if (minutes > 0) parts.push(minutes + '分');
  if (seconds > 0 || parts.length === 0) parts.push(seconds + '秒');

  return parts.join('');
}

client.once('clientReady', async () => {
  await client.application.commands.set(commands);

  client.on('interactionCreate', async (interaction) => {
    if(!(interaction.isChatInputCommand())) return;
    if(!(interaction.inGuild())) return;
    
    if(interaction.guildId !== SERVER_ID) return;

    try{
      switch(interaction.commandName){
        case "mute":
          if(mute_data) {
            await interaction.reply('すでにミュートが設定されています！');
            return;
          }

          const time = interaction.options.get('time').value;

          const now = new Date();
          let exp_time = new Date();
          exp_time.setMinutes(exp_time.getMinutes() + time);

          mute_data = {
            exp: exp_time,
            reason: interaction.options.get('reason').value
          };

          setTimeout(() => {
            mute_data = null;
          }, time *60 *1000);

          await interaction.reply(`ミュート設定を行いました。\n  Reason: ${mute_data.reason}\n  Exp: ${formatDate(mute_data.exp)}`);

          break;
        default:
          break;
      }
    }catch(e){
      console.error(e);
    }
  })

  console.log("Bot is online!");
});

client.on('presenceUpdate', (_, newPresence) => {
  if(!TARGET_IDS.some(id => newPresence.userId === id)) return;

  const channel = client.channels.cache.get(CHANNEL_ID);
  if(!channel) return; // チャンネルが無い場合なにもできない

  if(newPresence.status === "offline"){
    let mentionString = newPresence.guild?.roles.cache.has(MENTION) ? `<@&${MENTION}>` : `<@${MENTION}>`;

    if(mute_data){
      mentionString = `💤 [ミュート済み（Reason: ${mute_data.reason}, Exp: ${formatDate(mute_data.exp)}）]\n`
    }

    const startTime = new Date();

    channel.send(`⚠️ ${mentionString} <@${newPresence.userId}> がオフラインになりました！`)
      .then(msg => offlineData.set(newPresence.userId, { messageId: msg.id, startTime: startTime }))
      .catch(err => console.error(`メッセージ送信失敗: ${err}`));
  }else if(newPresence.status === "online") {
    // オンラインになったらメッセージ削除
    const data = offlineData.get(newPresence.userId);
    if (!data) return;

    channel.messages.fetch(data.messageId)
      .then(msg => msg.delete().catch(err => console.error(`メッセージ削除失敗: ${err}`)))
      .catch(err => console.error(`メッセージ取得失敗: ${err}`));
    
    const endTime = new Date();
    const duration = endTime - data.startTime;
    channel.send(`✅ <@${newPresence.userId}> がオンラインになりました！
オフラインだった時間: ${formatDate(data.startTime)} ～ ${formatDate(endTime)} (${formatDuration(duration)})`);
    offlineData.delete(newPresence.userId);
  }
});

client.login(TOKEN);
