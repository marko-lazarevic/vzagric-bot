const Discord = require("discord.js");
const bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const { prefix, token } = require('./config.json');



bot.on("ready", () => {
    console.log("Started");
});

bot.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
    if (!channel) return;
    channel.send(`Welcome to the server, ${member}!`);
});

bot.on("guildMemberRemove", member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
    if (!channel) return;
    channel.send(`${member} left the server!`);
});


bot.on("message", message => {
    if (message.content.startsWith(prefix)) {
        let args = message.content.substring(prefix.length).split(/ +/);
        switch (args[0]) {
            case "kick":
                {
                    if (message.member.hasPermission("ADMINISTRATOR")) {
                        const user = message.mentions.users.first();
                        if (user) {
                            const member = message.guild.member(user);
                            if (member) {
                                member
                                    .kick('You were kicked!')
                                    .then(() => {
                                        message.reply(`Successfully kicked ${user.tag}`);
                                    })
                                    .catch(err => {
                                        message.reply('I was unable to kick the member');
                                        console.error(err);
                                    });
                            } else {
                                message.reply("That user isn't in this guild!");
                            }
                        } else {
                            message.reply("You didn't mention the user to kick!");
                        }
                    } else {
                        message.reply("You dont have permission to do that!");
                    }
                };
                break;
            case "ban":
                {
                    if (message.member.hasPermission("BAN_MEMBERS")) {
                        const user = message.mentions.users.first();
                        if (user) {
                            const member = message.guild.member(user);
                            if (member) {
                                member
                                    .ban({
                                        reason: 'They were bad!',
                                    })
                                    .then(() => {
                                        message.reply(`Successfully banned ${user.tag}`);
                                    })
                                    .catch(err => {
                                        message.reply('I was unable to ban the member');
                                        console.error(err);
                                    });
                            } else {
                                message.reply("That user isn't in this guild!");
                            }
                        } else {
                            message.reply("You didn't mention the user to ban!");
                        }
                    } else {
                        message.reply("You dont have permission to do that!");
                    }
                };
                break;
            case "mute":
                {
                    if (message.member.hasPermission("ADMINISTRATOR")) {
                        const user = message.mentions.users.first();
                        if (user) {
                            const member = message.guild.member(user);
                            if (args[2]) {
                                var role = message.member.guild.roles.cache.find(role => role.name === "Mute");
                                member.roles.add(role).then(() => {
                                        message.reply(`Successfully muted!`);
                                    })
                                    .catch(err => {
                                        message.reply('I was unable to mute that member!');
                                        console.error(err);
                                    });
                                setTimeout(() => {
                                    member.roles.remove(role).then(() => {
                                            message.reply(`Successfully unmuted ${user.tag}!`);
                                        })
                                        .catch(err => {
                                            message.reply('I was unable to unmute that member!');
                                            console.error(err);
                                        });
                                }, args[2] * 1000);

                            } else {
                                message.reply("For how long to mute user?");
                            }
                        } else {
                            message.reply("You didn't mention the user to mute!");
                        }
                    } else {
                        message.reply("You dont have permission to do that!");
                    }

                };
                break;
            case "warn":
                {
                    if (message.member.hasPermission("ADMINISTRATOR")) {
                        const user = message.mentions.users.first();
                        if (user) {
                            const member = message.guild.member(user);
                            const fs = require('fs');
                            const fileName = './warns.json';
                            const file = require(fileName);

                            if (file[user.tag])
                                file[user.tag]++;
                            else
                                file[user.tag] = 1;

                            if (file[user.tag] == 3) {
                                var role = message.member.guild.roles.cache.find(role => role.name === "Mute");
                                member.roles.add(role).then(() => {
                                        message.reply(`Muted ${user.tag} for 1h because he/she get 3 warns!`);
                                    })
                                    .catch(err => {
                                        message.reply('I was unable to mute that member!');
                                        console.error(err);
                                    });
                                setTimeout(() => {
                                    member.roles.remove(role).then(() => {
                                            message.reply(`Successfully unmuted ${user.tag}!`);
                                        })
                                        .catch(err => {
                                            message.reply('I was unable to unmute that member!');
                                            console.error(err);
                                        });
                                }, 3600000);
                            } else if (file[user.tag] == 4) {
                                var role = message.member.guild.roles.cache.find(role => role.name === "Mute");
                                member.roles.add(role).then(() => {
                                        message.reply(`Muted ${user.tag} for 24h because he/she get 4 warns!`);
                                    })
                                    .catch(err => {
                                        message.reply('I was unable to mute that member!');
                                        console.error(err);
                                    });
                                setTimeout(() => {
                                    member.roles.remove(role).then(() => {
                                            message.reply(`Successfully unmuted ${user.tag}!`);
                                        })
                                        .catch(err => {
                                            message.reply('I was unable to unmute that member!');
                                            console.error(err);
                                        });
                                }, 86400000);
                            } else if (file[user.tag] == 5) {
                                member
                                    .ban({
                                        reason: 'They were bad!',
                                    })
                                    .then(() => {
                                        message.reply(`Successfully banned ${user.tag} because they got 5 warns.`);
                                    })
                                    .catch(err => {
                                        message.reply('I was unable to ban the member');
                                        console.error(err);
                                    });
                            }

                            fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
                                if (err) return console.log(err);
                                console.log(JSON.stringify(file));
                                console.log('writing to ' + fileName);
                            });
                            message.reply(`Warned ${user.tag}`);

                        } else {
                            message.reply("You didn't mention the user to warn!");
                        }
                    } else {
                        message.reply("You dont have permission to do that!");
                    }

                };
                break;
            case "warnList":
                {
                    if (message.member.hasPermission("ADMINISTRATOR")) {
                        const fs = require('fs');
                        const path = require('./warns.json');

                        let rawdata = fs.readFileSync('warns.json');
                        let obj = JSON.parse(rawdata);

                        message.channel.send("Warn list:");
                        for (const [key, value] of Object.entries(obj)) {
                            message.channel.send(`${key}: ${value}`);
                        }

                    } else {
                        message.reply("You dont have permission to do that!");
                    }
                };
                break;
            case "setStock":
                {

                    if (message.member.hasPermission("ADMINISTRATOR")) {
                        if (args[1]) {
                            var fs = require('fs');
                            fs.writeFile("stock.txt", args[1], function(err) {
                                if (err) {
                                    message.reply("Error updating stock!");
                                    console.log(err);
                                } else {
                                    message.reply("Stock updated successfully!");
                                }
                            });
                        } else {
                            message.reply("Send new stock value!");
                        }
                    } else {
                        message.reply("You dont have permission to do that!");
                    }

                };
                break;
            case "stock":
                {
                    var fs = require('fs');
                    fs.readFile("stock.txt", 'utf8', function(err, data) {
                        if (err) {
                            console.log(err);
                            message.channel.send("Error reading stock!");
                        } else {
                            message.channel.send("Stock value is:" + data);
                        }
                    });
                };
                break;
            case "verify":
                {

                    var role = message.member.guild.roles.cache.find(role => role.name === "Verified");
                    if (message.member.roles.cache.some(role => role.name === 'Verified')) {
                        message.reply("You are already verified!");
                    } else {
                        message.member.roles.add(role).then(() => {
                                message.reply(`Successfully set Verified role!`);
                            })
                            .catch(err => {
                                message.reply('I was unable to give you verified role!');
                                console.error(err);
                            });
                    }



                };
                break;
            case "embed":
                {
                    if (args[1] != undefined) {
                        const embed = new Discord.MessageEmbed()
                            .setColor(Math.floor(Math.random() * 16777215).toString(16))
                            .setDescription(args[1]);

                        message.channel.send(embed);
                    } else {
                        message.channel.send("Send a message to embed please");
                    }
                };
                break;
            case "help":
                {
                    if (message.member.hasPermission("ADMINISTRATOR")) {
                        var helpEmbed = new Discord.MessageEmbed()
                            .setTitle("HELP")
                            .setColor("#fff").addFields({ name: 'help', value: 'Shows this message.', inline: true }, { name: 'stock', value: 'Shows stock value.', inline: true }, { name: 'embed [message]', value: 'Embeds message you sent as parameter.', inline: true }, { name: 'verify', value: 'Gives you verified role.', inline: true });
                    } else {
                        var helpEmbed = new Discord.MessageEmbed()
                            .setTitle("HELP")
                            .setColor("#fff").addFields({ name: 'help', value: 'Shows this message.', inline: true }, { name: 'stock', value: 'Shows stock value.', inline: true }, { name: 'embed [message]', value: 'Embeds message you sent as parameter.', inline: true }, { name: 'verify', value: 'Gives you verified role.', inline: true });
                    }
                    message.channel.send(helpEmbed);
                };
                break;
        }


    }

});



bot.login(token);