const bot = require("../../bot");
const userDb = require("./user.db");

class UserActions {
    db;
    bot;
    constructor() {
        this.db = userDb;
        this.bot = bot;
    }

    async startMessage({ chat_id }) {
        this.bot.sendMessage(chat_id, "Хахахаха лох")
    }
}

module.exports = new UserActions();