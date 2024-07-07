const bot = require("../../bot");
const textReplacer = require("../../helper");
const { getField, setStatus, getText, setField } = require("../../helpers");
const universeButtons = require("./universe.buttons");
const universeDb = require("./universe.db");
const universeTexts = require("./universe.texts");

class UserActions {
    async addUniverse({ chat_id }, msg) {
        const userStatus = getField(chat_id, "status");
        if (!userStatus || userStatus === "command") {
            setStatus(chat_id, "admin/create_universe");
            return bot.sendMessage(chat_id, universeTexts.addUniverseFeedText);
        }
        const universeName = getText(msg);
        await universeDb.createUniverse(universeName);
        const sendText = textReplacer(universeTexts.successCreateUniverse, [["universe_name", universeName]]);

        bot.sendMessage(chat_id, sendText);
    }
    async editUniverse({ chat_id }, msg) {
        const userStatus = getField(chat_id, "status");
        let editUniverseStatus = getField(chat_id, "editUniverseStatus");

        if (!userStatus || userStatus === "command") {
            setStatus(chat_id, "admin/edit_universe");
            const buttons = await universeButtons.getUniverseButtons();
            return bot.sendMessage(chat_id, universeTexts.editUniverseFeedText, buttons);
        }
        if (!editUniverseStatus) {
            setField(chat_id, "editUniverseStatus", {});
            editUniverseStatus = getField(chat_id, "editUniverseStatus");
        }
        if (!("id" in editUniverseStatus)) {
            const universeId = getText(msg);
            editUniverseStatus.id = universeId;
            const sendText = universeTexts.editUniverseTypeNameText;
            return bot.sendMessage(chat_id, sendText);
        }
        const universeName = getText(msg);
        await universeDb.editUniverse(universeName, editUniverseStatus.id);
        setStatus(chat_id, "command");
        const sendText = textReplacer(universeTexts.successEditUniverse, [["universe_name", universeName]]);
        return bot.sendMessage(chat_id, sendText);
    }
    async deleteUniverse({ chat_id }, msg) {
        const userStatus = getField(chat_id, "status");

        if (!userStatus || userStatus === "command") {
            setStatus(chat_id, "admin/delete_universe");
            const buttons = await universeButtons.getUniverseButtons();
            return bot.sendMessage(chat_id, universeTexts.deleteUniverseFeedText, buttons);
        }

        const universeId = getText(msg);
        await universeDb.deleteUniverse(universeId);
        setStatus(chat_id, "command");
        return bot.sendMessage(chat_id, universeTexts.successDeleteUniverse);
    }
}

module.exports = new UserActions();