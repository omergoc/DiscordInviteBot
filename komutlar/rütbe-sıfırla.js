const Discord = require("discord.js");
const Database = require("../Helpers/Database");


exports.run = async (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR") && !message.member.hasPermission("MANAGE_GUILD")) return message.reply("Yetkiniz bulunmamaktadır!");
const db = new Database("./Servers/" + message.guild.id, "Rewards");
    const db2 = new Database("./Servers/" + message.guild.id, "Invites");
db.set("rewards");
message.inlineReply("Davet rolleri sıfırlandı!")
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};
exports.help = {
  name: 'rütbe-sıfırla',
  description: 'Logo Yaparsınız',
  usage: 'm-logo <yazı>'
};

