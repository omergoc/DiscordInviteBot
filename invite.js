const { Collection, Client } = require("discord.js");
const ayarlar = require('./ayarlar.json');
const Discord = require('discord.js');
const Database = require("./Helpers/Database");
const client = new Client;

const Invites = new Collection(); 

client.on("ready", () => {
    client.guilds.cache.forEach(guild => {
        guild.fetchInvites().then(_invites => {
            Invites.set(guild.id, _invites);
        }).catch(err => { });
    });
});

client.on("inviteCreate", (invite) => {
    var gi = Invites.get(invite.guild.id);
    gi.set(invite.code, invite);
    Invites.set(invite.guild.id, gi);
});
client.on("inviteDelete", (invite) => {
    var gi = Invites.get(invite.guild.id);
    gi.delete(invite.code);
    Invites.set(invite.guild.id, gi);
});


client.on("guildCreate", (guild) => {
	guild.fetchInvites().then(invites => {
		Invites.set(guild.id, invites);
	}).catch(e => {})
});


client.on("guildMemberAdd", (member) => {
    //const gi = new Collection().concat(Invites.get(member.guild.id));
    const db = new Database("./Servers/" + member.guild.id, "Invites"), gi = (Invites.get(member.guild.id) || new Collection()).clone(), settings = new Database("./Servers/" + member.guild.id, "Settings").get("settings") || {};
    var guild = member.guild, fake = (Date.now() - member.createdAt) / (1000 * 60 * 60 * 24) <= 3 ? true : false, channel = guild.channels.cache.get(settings.Channel);
    guild.fetchInvites().then(invites => {
        // var invite = invites.find(_i => gi.has(_i.code) && gi.get(_i.code).maxUses != 1 && gi.get(_i.code).uses < _i.uses) || gi.find(_i => !invites.has(_i.code)) || guild.vanityURLCode;
        var invite = invites.find(_i => gi.has(_i.code) && gi.get(_i.code).uses < _i.uses) || gi.find(_i => !invites.has(_i.code)) || guild.vanityURLCode;
        Invites.set(member.guild.id, invites);
        var content = `${member} sunucuya katıldı!`, total = 0, regular = 0, _fake = 0, bonus = 0;
        if(invite == guild.vanityURLCode) content = settings.defaultMessage ? settings.defaultMessage : `${member} özel davet linki ile sunucuya katıldı :tada:`;
        else content = settings.welcomeMessage ? settings.welcomeMessage : `${member}, belirsiz bir davet linkiyle sunucuya katıldı o_O`;

        if (invite.inviter) { 
            db.set(`invites.${member.id}.inviter`, invite.inviter.id); 
            if(fake){
                total = db.add(`invites.${invite.inviter.id}.total`, 1);
                _fake = db.add(`invites.${invite.inviter.id}.fake`, 1);
            }
            else{
                total = db.add(`invites.${invite.inviter.id}.total`, 1);
                regular = db.add(`invites.${invite.inviter.id}.regular`, 1);
            }
            var im = guild.member(invite.inviter.id);
            bonus = db.get(`invites.${invite.inviter.id}.bonus`) || 0;
            if(im) global.onUpdateInvite(im, guild.id, Number(total + Number(bonus)));
            
        }

        db.set(`invites.${member.id}.isfake`, fake);

    if(channel){
        const embed = new Discord.MessageEmbed()
        .setTitle("BİR DAVET EKLENDİ!")
        .setColor("GREEN")
        .addField("Kullanıcı", member || "Bilinmiyor...", true)
        .addField("Davet Eden",  invite.inviter || "Bilinmiyor...", true)
        .addField("Davet Sayısı", total + bonus || "Bilinmiyor...", true)
        .setThumbnail(member.user.avatarURL({dynamic: true}))
        .setFooter(`${ayarlar.sunucuadı} • Davet Sistemi`)
       channel.send(embed)
    }
    }).catch();
});

client.on("guildMemberRemove", (member) => {
    const db = new Database("./Servers/" + member.guild.id, "Invites"), settings = new Database("./Servers/" + member.guild.id, "Settings").get("settings") || {};
    var total = 0, bonus = 0, regular = 0, fakecount = 0, channel = member.guild.channels.cache.get(settings.Channel), content = settings.leaveMessage ? settings.leaveMessage : `${member} sunucudan ayrıldı!`, data = db.get(`invites.${member.id}`);
    if(!data){
        return;
    }
        if(data === null) data = "Bulunamadı"
    if(data.isfake && data.inviter){
        fakecount = db.sub(`invites.${data.inviter}.fake`, 1);
        total = db.sub(`invites.${data.inviter}.total`, 1);
    }
    else if(data.inviter){
        regular = db.sub(`invites.${data.inviter}.regular`, 1);
        total = db.sub(`invites.${data.inviter}.total`, 1);
    }
    if(data.inviter) bonus = db.get(`invites.${data.inviter}.bonus`) || 0;
    
    var im = member.guild.member(data.inviter)
    if(im) global.onUpdateInvite(im, member.guild.id, Number(total) + Number(bonus));

    db.add(`invites.${data.inviter}.leave`, 1);
     if(channel){
        let user = client.users.cache.get(data.inviter)
        const embed = new Discord.MessageEmbed()
        .setTitle("BİR DAVET SİLİNDİ!")
        .setColor("RED")
        .addField("Kullanıcı", member.user || "Bilinmiyor...", true)
        .addField("Davet Eden",  user || "Bilinmiyor...", true)
        .addField("Davet Sayısı", Number(total) + Number(bonus) || "Bilinmiyor...", true)
        .setThumbnail(member.user.avatarURL({dynamic: true}))
        .setFooter(`${ayarlar.sunucuadı} • Davet Sistemi`)
        channel.send(embed)
     }
});


global.onUpdateInvite = (guildMember, guild, total) => {
    if(!guildMember.manageable) return;
    const rewards = new Database("./Servers/" + guild, "Rewards").get("rewards") || [];
    if(rewards.length <= 0) return;
    var taken = rewards.filter(reward => reward.Invite > total && guildMember.roles.cache.has(reward.Id));
    taken.forEach(take => {
        guildMember.roles.remove(take.Id);
    });
    var possible = rewards.filter(reward => reward.Invite <= total && !guildMember.roles.cache.has(reward.Id));
    possible.forEach(pos =>{
        guildMember.roles.add(pos.Id);
    });
}
client.login(ayarlar.token)