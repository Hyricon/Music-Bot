const { Discord, Colors } = require("discord.js");
const { MessageEmbed } = require("discord.js-light");
const { DisTube, Queue, Song } = require("distube");

/**
 *
 * @param {Discord} Discord
 * @param {DisTube} distube
 */

module.exports = async (Discord, distube) => {
  distube.on("playSong", async (queue, song) => {
    queue.textChannel.send({
      embeds: [
        new MessageEmbed()
          .setColor("BLUE")
          .setTitle("▶️  Started playing")
          .setDescription(`[\`${song.name}\`] (${song.url}) [${song.user}]`)
          .setImage(song.thumbnail)
          .setFooter({
            text: ` Requested by ${song.user.tag}`,
            iconURL: song.user.displayAvatarURL({ dynamic: true }),
          }),
      ],
    });
  });
  distube.on("addSong", async (queue, song) => {
    queue.textChannel.send({
      embeds: [
        new MessageEmbed()
          .setColor("BLUE")
          .setTitle("🎵  SONG ADDED TO QUEUE")
          .setDescription(`[\`${song.name}\`]  [${song.user}]`),
      ],
    });
  });
  distube.on("disconnect", async (queue) => {
    queue.textChannel.send({
      embeds: [
        new MessageEmbed()
          .setColor("RED")
          .setDescription(
            `📤 Disconnected From ${queue.voiceChannel} Voice Channel `
          ),
      ],
    });
  });
};
