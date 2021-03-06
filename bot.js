﻿const Discord = require('discord.js');
const client = new Discord.Client();
const bot = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.on("ready", () => {
  client.user.setGame(prefix + `yardım | ` + client.guilds.size + ` adet sunucuya ve ` + client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString() + ` kullanıcıya hizmet veriliyor! | Davet etmek için p!davet`) 
  console.log("Bağlandım!")   
});
bot.on('guildMemberAdd', member => {
  const channel = member.guild.channels.find('name', 'hosgeldiniz-log');
  if (!channel) return;
  if(!channel) return message.channel.send(" `hosgeldiniz-log` İsminde Yazı Kanalı Bulamıyorum.!");
  
  channel.send(`Sunucuya hoşgeldiniz, ${member}`);
  const sunucubilgi = new Discord.RichEmbed()
  .setAuthor(`Aramıza Hoşgeldin ${member}`)
  .setColor(3447003)
  .setTimestamp()
  .setDescription('')
  .setImage(``)
  return message.channel.sendEmbed(sunucubilgi);
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'sa') {
    msg.channel.send('Aleyküm Selam,  Hoş Geldin');
  }
});




client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};
//////Fırtınanın Otorol Başlangış/////////
client.giveAutoRole = (member) => {
    try {
      fs.exists("autorole.json",(exist)=> {
        if (!exist) {console.log("bulunamadı")}
        else {
          obj = jsonfile.readFileSync("autorole.json");
          let autorole = member.guild.roles.find('id',obj[member.guild.id])
          if(!autorole) {
            console.log("autorole Belirlenmemiş!")
          } else {
            member.addRole(autorole).catch();
          }
        } 
      })
    } catch (ex) {
      console.error(ex)
    }
  }
///////////// FIrtınanın Otorol Bitiş
var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.on("message", async message => {
    if (!message.guild) return
    if (message.guild.id == "509056257773142028") {
    if (message.content.toLowerCase() === prefix + 'js') {
      let rol = message.guild.roles.find(r => r.name === "@Bot Geliştiricileri ");
      if (!rol) return message.reply("Hata: Rol bulunamadı! `Lütfen yetkililere bildiriniz!`")
      message.member.addRole(rol)
      message.channel.send(":white_check_mark: **Başarıyla rolü aldın!**")
    }
    } else {
     return
    }
})

client.login(process.env.BOT_TOKEN);
