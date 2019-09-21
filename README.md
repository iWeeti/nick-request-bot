Add `config.json` to the root directory with the content:

```json
{
    "token": "",  BOT TOKEN
    "prefix": "",  COMMAND PREFIX

    "verificationChannelID": "",  VERIFICATION CHANNEL ID
    "restrictRequestChannel": true,  RESTRICT REQUESTS TO ONE CHANNEL?
    "requestChannelID": "", IF RESTRICTED, REQUEST CHANNEL ID

    "approveEmoji": "",  EMOJI ID OR AN ACTUAL EMOJI, NOT THE NAME
    "declineEmoji": "",  SAME AS ABOVE
    "requiredRoles": [""]  ROLES YOU NEED TO APPROVE IF NONE NO ROLES NEEDED
}
```

Run `npm i` to install the dependencies. **RUN THIS ONLY ONCE**
Then run `npm start` to start the bot.

> It spams some random errors when you approve or decline and I don't know what causes them...
