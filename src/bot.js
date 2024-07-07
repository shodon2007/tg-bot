const TelegramBot = require("node-telegram-bot-api/lib/telegram");
const { token } = require("./consts");
class Bot {
    static instance;
    constructor() {
        if (Bot.instance) {
            return Bot.instance;
        }
        return new TelegramBot(token, { polling: true });
    }
}

module.exports = new Bot();