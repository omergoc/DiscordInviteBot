const Discord = require("discord.js");
const Database = require("../Helpers/Database");
// exports.onLoad = (client) => {};
/**
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array<String>} args 
 */
exports.run = async (client, message, args) => {
    const db = new Database("./Servers/" + message.guild.id, "Invites");
    var data = db.get(`invites.${message.member.id}`) || { total: 0, fake: 0, inviter: null, regular: 0, bonus: 0, leave: 0 };
    var embed = new Discord.MessageEmbed()
    .setTitle(message.author.tag)
    .setThumbnail(message.author.avatarURL({dynamic: true}))
    .setDescription(`
    **Toplam**
    > \`${(data.total || 0) + (data.bonus || 0)} Kişi\`
    
    **Sunucuda Bulunan**
    > \`${data.regular || 0} Kişi\`
    
    **Sunucudan Çıkan**
    > \`${data.leave || 0} Kişi\`
    
    **Sahte Kullanıcı**
    > \`${data.fake || 0} Kişi\`

    **Bonus**
    > \`${data.bonus || 0} Kişi\`
    `)
    .setColor("RANDOM");
    message.inlineReply(embed);
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["invite"],
  permLevel: 0
};
exports.help = {
  name: 'davetlerim',
  description: 'Logo Yaparsınız',
  usage: 'm-logo <yazı>'
};
