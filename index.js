const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.MessageContent,
  ],
});
const fs = require("fs");
const config = require("./config.json");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { CLIENT_RENEG_LIMIT } = require("tls");
const { default: DisTube, Song } = require("distube");
const { type } = require("os");
const { MessageEmbed } = require("discord.js-light");
const { EmbedBuilder } = require('discord.js');

const distube = new DisTube(client, {
  emitNewSongOnly: false,
  leaveOnEmpty: true,
  leaveOnFinish: true,
  leaveOnStop: false,
  searchSongs: 0,
});
this.id = distube.id;
/**
 * Get or set the stream volume. Default value: `50`.
 * @type {number}
 */
this.volume = 100;

const PREFIX = "?";

client.on("ready", async () => {  
  console.log("Bot Is Online");
  client.user.setActivity("Hyricon Development");
});

require("./events")(Discord, distube);

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  let args = message.content.slice(PREFIX.length).trim().split(/ +/);
  let cmd = args.shift()?.toLowerCase();

  let queue = distube.getQueue(message);


  // Help System Made By Prajwal 
  switch (cmd) {
    case "help":
      {
        const help = new EmbedBuilder()
	        .setColor("Blue")
	        .setTitle('Help')
	        .setDescription('Help Panel For Music Bot')
	        .addFields(
		              { name: 'Play Song', value: '`?play <song name>`' },
		              { name: 'Stop Song', value: '`?stop`' },
		              { name: 'Skip Song', value: '`?skip`' },
		              { name: 'Pause Song', value: '`?pause`' },
                  { name: 'Resume Song', value: '`?resume`'},
                  { name: 'Set Volume', value: '`?volume <amount>`' },
                  { name: 'Show Queue Of Song', value: '`?queue`' },
                  { name: 'Loop The Queue Or Song', value: '`?loop`' },
	                ) 
	        .setFooter({ text: '(c) Hyricon Development' });

          message.reply({ embeds: [help] });
      }
      break;

    case "play":
      {
        let song = args.join("  ");
        let VoiceChannel = message.member.voice.channel;
        if (!VoiceChannel) {
          return message.reply({
            embeds: [
              new MessageEmbed()
                .setColor("RED")
                .setDescription(`You Must Be In Voice Channel`),
            ],
          });
        } else if (!song) {
          return message.reply("please provide a song url");
        } else {
          distube.play(VoiceChannel, song, {
            member: message.member,
            message: message,
            textChannel: message.channel,
          });
        }
      }
      break;

    case "skip":
      {
        let song = args.join("  ");
        let VoiceChannel = message.member.voice.channel;
        if (!VoiceChannel) {
          return message.reply({
            embeds: [
              new MessageEmbed()
                .setColor("RED")
                .setDescription(`You Must Be In Voice Channel`),
            ],
          });
        } else if (!queue) {
          return message.reply("Nothing Playing !help to know more");
        } else {
          queue.skip().then((s) => {
            queue.textChannel.send({
              embeds: [
                new MessageEmbed()
                  .setColor("BLUE")
                  .setTitle(`🎵 SONG HAS BEEN SKIPPED TO [\`${song.title}\`]`)
                  .setDescription("DO `?help` TO KNOW MORE!"),
              ],
            })
            
          });
        }
      }
      break;

    case "stop":
      {
        let VoiceChannel = message.member.voice.channel;
        if (!VoiceChannel) {
          return message.reply({
            embeds: [
              new MessageEmbed()
                .setColor("RED")
                .setDescription(`You Must Be In Voice Channel`),
            ],
          })
        } else if (!queue) {
          return message.reply("Nothing Playing !help to know more");
        } else {
          queue.stop().then((s) => {
            queue.textChannel.send({
              embeds: [
                new MessageEmbed()
                  .setColor("BLUE")
                  .setTitle("🎵 SONG HAS BEEN STOPPED")
                  .setDescription("DO `?play` TO PLAY A SONG"),
              ],
            })
          });
        }
      }
      break;

    case "pause":
      {
        let VoiceChannel = message.member.voice.channel;
        if (!VoiceChannel) {
          return message.reply({
            embeds: [
              new MessageEmbed()
                .setColor("RED")
                .setDescription(`You Must Be In Voice Channel`),
            ],
          })
        } else if (!queue) {
          return message.reply("Nothing Playing !help to know more");
        } else if (queue.paused) {
          return message.reply(" song already paused ");
        } else {
          queue.pause();
          message.reply('song has been stopped')
        }
      }
      

      break;

    case "resume":
      {
        let VoiceChannel = message.member.voice.channel;
        if (!VoiceChannel) {
          return message.reply({
            embeds: [
              new MessageEmbed()
                .setColor("RED")
                .setDescription(`You Must Be In Voice Channel`),
            ],
          })
        } else if (!queue) {
          return message.reply("Nothing Playing !help to know more");
        } else if (!queue.paused) {
          return message.reply(`SONG HAS ALREADY RESMED`)
        } else {
          queue.resume();
        }
      }
      queue.textChannel.send({
        embeds: [
          new MessageEmbed()
            .setColor("BLUE")
            .setTitle("🎵 SONG HAS BEEN RESUMED")
            .setDescription("DO `?pause` to PAUSE THE SONG"),
        ],
      });
      break;
    case "volume":
    {
      let VoiceChannel = message.member.voice.channel;
      let volume = Number(args[0]);
      if (!VoiceChannel) {
        return message.reply(` Please Provide Volume `);
      } else if (!queue) {
        return message.reply(`northing playing`);
      } else if (!volume) {
        return message.reply(`please provide a amount`)
      } else {
        queue.setVolume(volume)
        message.reply(message, `Volume Set to \`${queue.volume}\`% !`);
      }
    };
      break;
    case "queue":
      {
        let VoiceChannel = message.member.voice.channel;
        if (!VoiceChannel) {
          return message.reply({
            embeds: [
              new MessageEmbed()
                .setColor("RED")
                .setDescription(`You Must Be In Voice Channel`),
            ],
          })
        } else if (!queue) {
          return message.reply("Nothing Playing !help to know more");
        } else {
          let song = queue.songs
            .slice(0, 10)
            .map((song, index) => {
              return `\`${index + 1}\` [\`${song.name}\`]  (${song.url}) [${
                song.formattedDuration
              }] `;
            })
            .join("\n");
          message.reply({
            embeds: [
              new MessageEmbed()
                .setColor("BLUE")
                .setTitle(`Queue of ${message.author.tag}`)
                .setDescription(song)
                .setFooter({
                  text: ` Requested by ${message.author.tag}`,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                }),
            ],
          });
        }
      }
      break;
    case "loop":
      {
        let VoiceChannel = message.member.voice.channel;
        let loopmode = args[0];
        let mods = ["song", "queue", "off"];

        if (!VoiceChannel) {
          return message.reply({
            embeds: [
              new MessageEmbed()
                .setColor("RED")
                .setDescription(`You Must Be In Voice Channel`),
            ],
          });
        } else if (!queue) {
          return message.reply("Nothing Playing !help to know more");
        } else if (!mods.includes(loopmode)) {
          return message.reply(` wrong usage \n > ${mods.join(" , ")}`);
        } else {
          if (loopmode === "song") {
            queue.setRepeatMode(1);
            message.reply("loop mode enabled");
          } else if (loopmode === "queue") {
            queue.setRepeatMode(2);
            message.reply(" queue loop mode enabled");
          } else if (loopmode === "off") {
            queue.setRepeatMode(0);
            message.reply("loop mode disabled");
          }
        }
      }
      break;

    default:
      break;
  }
});

client.login(config.token);
console.log("The Bot Has Started!! Enjoy Your Listing")