module.exports = client => {
   client.user.setStatus('dnd') 
   client.user.setActivity(`İnsanları ve davetleri`, {type: 'WATCHING'});
   console.log(`[ BOT HAZIR ]`)
};