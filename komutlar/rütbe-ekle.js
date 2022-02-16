const Discord = require("discord.js");
const Database = require("../Helpers/Database");
// exports.onLoad = (client) => {};
/**
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array<String>} args 
 */
exports.run = async (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR") && !message.member.hasPermission("MANAGE_GUILD")) return message.inlineReply("Yetkiniz bulunmamaktadır!");

    
    var roleId = message.mentions.roles.first(), targetInvite = Number(args[1]);
  /*  if(!message.guild.roles.cache.has(roleId)) return message.inlineReply("Böyle bir rol yok!");*/
    if(isNaN(targetInvite)) return message.inlineReply("Bir sayı girin!");

    const db = new Database("./Servers/" + message.guild.id, "Rewards");

    var rewards = db.get("rewards") || [];
    rewards.push({
        Id: roleId.id,
        Invite: targetInvite
    });

    db.set("rewards", rewards);
const embed = new Discord.MessageEmbed()
.setDescription(`**${roleId} rolünü elde edebilmek için ${targetInvite} davet yapılmalıdır!**`)
message.inlineReply(embed)
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};
exports.help = {
  name: 'rütbe-ekle',
  description: 'Logo Yaparsınız',
  usage: 'm-logo <yazı>'
};
