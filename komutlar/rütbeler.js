const Discord = require("discord.js");
const Database = require("../Helpers/Database");

exports.run = async (client, message, args) => {
    const db = new Database("./Servers/" + message.guild.id, "Rewards");
    var data = db.get(`rewards`) || {};

    var list = data.sort((x, y) => y.targetInvite - x.targetInvite);
      if(list.length === 0){
        var yok = new Discord.MessageEmbed()
            .setAuthor("Hiç rütbe ayarlanmamış!")
            .setDescription("Ayarlamak İçin !rütbe-ekle @rol davetsayi");
            return message.inlineReply(yok);
        }

    var embed = new Discord.MessageEmbed()
    .setTitle("DAVET ROLLERİ/RÜTBELERİ")
        .setDescription(`${list.splice(0, 10).map((item, index) => `\`${index + 1}.\` <@&${item.Id}> • \`${item.Invite} Davet\``).join("\n")}`);

    message.inlineReply(embed).then(m => m.delete({ timeout: 5000 }));
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};
exports.help = {
  name: 'rütbeler',
  description: 'Logo Yaparsınız',
  usage: 'm-logo <yazı>'
};
