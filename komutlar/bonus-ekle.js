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

    var victim = message.mentions.members.size > 0 ? message.mentions.members.first().id : args.length > 0 ? args[0] : undefined;
    if(!victim) return message.inlineReply("Lütfen bir kullanıcı ID'si yazın!");
    victim = message.guild.member(victim);
    if(!victim) return message.inlineReply("ID'sini yazdığınız kullanıcı sunucuda bulunmamaktadır!");

    var num = Number(args[1]);
    if(isNaN(num)) return message.inlineReply("Lütfen bonus olarak eklenecek sayıyı girin!");
    const db = new Database("./Servers/" + message.guild.id, "Invites");

    var bonus = (db.add(`invites.${victim.id}.bonus`, num) || 0), total = (db.get(`invites.${victim.id}.total`) || 0);
    message.inlineReply(`${victim} isimli kullanıcıya ${num} adet bonus eklendi!`);

    global.onUpdateInvite(victim, message.guild.id, total + bonus);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};
exports.help = {
  name: 'bonus-ekle',
  description: 'Logo Yaparsınız',
  usage: 'm-logo <yazı>'
};
