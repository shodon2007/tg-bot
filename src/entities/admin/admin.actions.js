const bot = require("../../bot");
const textReplacer = require("../../helper");
const adminButtons = require("./admin.buttons");
const adminDB = require("./admin.db");
const adminTexts = require("./admin.texts");

class AdminActions {
    constructor() {
        this.db = adminDB;
        this.bot = bot;
    }

    async adminFeed({ chat_id }, msg) {
        const isAdmin = this.db.adminList.includes(chat_id);

        if (isAdmin) {
            const text = textReplacer(adminTexts.isAdminText, [["username", msg.from.username]]);
            const buttons = adminButtons.adminFeedButtons;
            return await bot.sendMessage(chat_id, text, buttons);
        }
        const text = textReplacer(adminTexts.isNoAdminText, [["username", msg.from.username]]);
        return await bot.sendMessage(chat_id, text);

    }
}

module.exports = new AdminActions();