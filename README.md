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

Then run `npm start` to start the bot.
