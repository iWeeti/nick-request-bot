"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const config_json_1 = __importDefault(require("../config.json"));
if (config_json_1.default.requestChannelID === null ||
    (config_json_1.default.requestChannelID === "" && config_json_1.default.restrictRequestChannel == true)) {
    console.error("YOU NEED TO SPECIFY A REQUEST CHANNEL ID BECAUSE YOU HAVE ENABLED THE RESTRICT FOR IT");
}
if (config_json_1.default.verificationChannelID === null ||
    config_json_1.default.verificationChannelID === "") {
    console.error("YOU NEED TO SPECIFY A VERIFICATION CHANNEL ID");
}
const client = new discord_js_1.default.Client();
client.on("ready", () => {
    console.log(`Ready on: ${client.user.tag} (${client.user.id})`);
});
client.on("message", m => {
    if (m.author.bot || !m.content.startsWith(config_json_1.default.prefix))
        return;
    if (config_json_1.default.restrictRequestChannel &&
        m.channel.id !== config_json_1.default.requestChannelID)
        return;
    const args = m.content
        .slice(config_json_1.default.prefix.length, m.content.length)
        .split(" ");
    const command = args.shift();
    console.log(command);
    if (command === "request") {
        let already = false;
        const channel = m.guild.channels.get(config_json_1.default.verificationChannelID);
        if (channel && channel instanceof discord_js_1.default.TextChannel) {
            channel
                .fetchMessages({
                limit: 100,
            })
                .then(msgs => {
                msgs.map(msg => {
                    if (msg !== null &&
                        msg.embeds.length !== 0 &&
                        msg.embeds[0].footer.text === m.author.id) {
                        already = true;
                    }
                });
            });
        }
        if (already)
            return;
        const e = new discord_js_1.default.RichEmbed();
        e.setTitle("Nick Request");
        e.setAuthor(m.author.tag, m.author.displayAvatarURL);
        e.setColor(m.member.displayColor);
        e.setDescription(args.join(" "));
        e.setTimestamp(m.createdTimestamp);
        e.setFooter(m.author.id);
        const c = m.guild.channels.get(config_json_1.default.verificationChannelID);
        if (c && c instanceof discord_js_1.default.TextChannel) {
            c.send(e).then((m) => __awaiter(void 0, void 0, void 0, function* () {
                if (m instanceof discord_js_1.default.Message) {
                    let emoji = m.guild.emojis.get(config_json_1.default.approveEmoji);
                    console.log(emoji);
                    yield m.react(emoji !== undefined ? emoji : config_json_1.default.approveEmoji);
                    emoji = m.guild.emojis.get(config_json_1.default.declineEmoji);
                    yield m.react(emoji !== undefined ? emoji : config_json_1.default.declineEmoji);
                }
            }));
        }
        m.reply(`Requested a nickname change to \`${args.join(" ")}\``);
    }
});
client.on("messageReactionAdd", (r, u) => {
    if (u.bot)
        return;
    if (r.message.channel.id !== config_json_1.default.verificationChannelID)
        return;
    const m = r.message.guild.members.get(r.message.embeds[0].footer.text);
    if (m === undefined)
        return;
    if (config_json_1.default.requiredRoles.length == 0) {
        return console.error("You need to specify a Role ID for verificators to have.");
    }
    else {
        const member = r.message.guild.members.get(u.id);
        if (member)
            member.roles.forEach(role => {
                if (config_json_1.default.requiredRoles.includes(role.id)) {
                    if (r.emoji.id == config_json_1.default.approveEmoji ||
                        r.emoji.name == config_json_1.default.approveEmoji) {
                        let failed = false;
                        m.edit({
                            nick: r.message.embeds[0].description,
                        })
                            .catch(reason => {
                            failed = true;
                            u.send(`I couldn't change the nickname: ${reason}`);
                        })
                            .then(asd => {
                            if (!failed) {
                                r.message.delete();
                                m.user
                                    .send(`Your nickname request in ${r.message.guild.name} has been accepted!\nYour name is now ${r.message.embeds[0].description}`)
                                    .catch();
                            }
                        });
                    }
                    else if (r.emoji.id == config_json_1.default.declineEmoji ||
                        r.emoji.name == config_json_1.default.declineEmoji) {
                        r.message.delete().then(a => {
                            m.user
                                .send(`Your nickname request in ${r.message.guild.name} has been declined :frowning:`)
                                .catch();
                        });
                    }
                }
                else
                    r.remove(u);
            });
    }
});
client.login(config_json_1.default.token);
