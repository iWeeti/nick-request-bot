import Discord, { Message } from "discord.js";
import config from "../config.json";

if (
    config.requestChannelID === null ||
    (config.requestChannelID === "" && config.restrictRequestChannel == true)
) {
    console.error(
        "YOU NEED TO SPECIFY A REQUEST CHANNEL ID BECAUSE YOU HAVE ENABLED THE RESTRICT FOR IT",
    );
}
if (
    config.verificationChannelID === null ||
    config.verificationChannelID === ""
) {
    console.error("YOU NEED TO SPECIFY A VERIFICATION CHANNEL ID");
}

const client = new Discord.Client();

client.on("ready", () => {
    console.log(`Ready on: ${client.user.tag} (${client.user.id})`);
});

client.on("message", m => {
    if (m.author.bot || !m.content.startsWith(config.prefix)) return;

    if (
        config.restrictRequestChannel &&
        m.channel.id !== config.requestChannelID
    )
        return;

    const args: string[] = m.content
        .slice(config.prefix.length, m.content.length)
        .split(" ");
    const command = args.shift();
    console.log(command);

    if (command === "request") {
        let already = false;
        const channel = m.guild.channels.get(config.verificationChannelID);
        if (channel && channel instanceof Discord.TextChannel) {
            channel
                .fetchMessages({
                    limit: 100,
                })
                .then(msgs => {
                    msgs.map(msg => {
                        if (
                            msg !== null &&
                            msg.embeds.length !== 0 &&
                            msg.embeds[0].footer.text === m.author.id
                        ) {
                            already = true;
                        }
                    });
                });
        }

        if (already) return;

        const e = new Discord.RichEmbed();
        e.setTitle("Nick Request");
        e.setAuthor(m.author.tag, m.author.displayAvatarURL);
        e.setColor(m.member.displayColor);
        e.setDescription(args.join(" "));
        e.setTimestamp(m.createdTimestamp);
        e.setFooter(m.author.id);

        const c = m.guild.channels.get(config.verificationChannelID);
        if (c && c instanceof Discord.TextChannel) {
            c.send(e).then(m => {
                if (m instanceof Discord.Message) {
                    let emoji = m.guild.emojis.get(config.approveEmoji);
                    console.log(emoji);
                    m.react(
                        emoji !== undefined ? emoji : config.approveEmoji,
                    ).then(v => {
                        emoji = m.guild.emojis.get(config.declineEmoji);
                        m.react(
                            emoji !== undefined ? emoji : config.declineEmoji,
                        );
                    });
                }
            });
        }
        m.reply(`Requested a nickname change to \`${args.join(" ")}\``);
    }
});

client.on("messageReactionAdd", (r, u) => {
    if (u.bot) return;
    if (r.message.channel.id !== config.verificationChannelID) return;

    const m: Discord.GuildMember | undefined = r.message.guild.members.get(
        r.message.embeds[0].footer.text,
    );
    if (m === undefined) return;

    if (config.requiredRoles.length == 0) {
        return console.error(
            "You need to specify a Role ID for verificators to have.",
        );
    } else {
        const member = r.message.guild.members.get(u.id);
        if (member)
            member.roles.forEach(role => {
                if (config.requiredRoles.includes(role.id)) {
                    if (
                        r.emoji.id == config.approveEmoji ||
                        r.emoji.name == config.approveEmoji
                    ) {
                        let failed = false;
                        m.edit({
                            nick: r.message.embeds[0].description,
                        })
                            .catch(reason => {
                                failed = true;
                                u.send(
                                    `I couldn't change the nickname: ${reason}`,
                                );
                            })
                            .then(asd => {
                                if (!failed) {
                                    r.message.delete();
                                    m.user
                                        .send(
                                            `Your nickname request in ${r.message.guild.name} has been accepted!\nYour name is now ${r.message.embeds[0].description}`,
                                        )
                                        .catch();
                                }
                            });
                    } else if (
                        r.emoji.id == config.declineEmoji ||
                        r.emoji.name == config.declineEmoji
                    ) {
                        r.message.delete().then(a => {
                            m.user
                                .send(
                                    `Your nickname request in ${r.message.guild.name} has been declined :frowning:`,
                                )
                                .catch();
                        });
                    }
                } else r.remove(u);
            });
    }
});

client.login(config.token);
