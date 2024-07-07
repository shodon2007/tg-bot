const bot = require("../../bot");
const cardDB = require("./card.db");
const { setStatus, setField, getField, getText } = require("../../helpers");
const cardTexts = require("./card.texts");
const cardButtons = require("./card.buttons");
const cardDb = require("./card.db");

class CardActions {
    getCardFromStore(chat_id) {
        const card = getField(chat_id, "card");
        if (!card) {
            setField(chat_id, "card", {});
        }
        return getField(chat_id, "card")
    }
    async createCard({ chat_id }, msg) {
        const userStatus = getField(chat_id, "status");
        const createCardStatus = getField(chat_id, "createCardStatus");
        const card = this.getCardFromStore(chat_id);
        const buttons = await cardButtons.addCardButtons();
        const createFields = [
            { field: "name", nextField: "rarity_id" },
            { field: "rarity_id", nextField: "attack" },
            { field: "attack", nextField: "health" },
            { field: "health", nextField: "price" },
            { field: "price", nextField: "universe_id" },
            { field: "universe_id", nextField: "photo_id" },
            { field: "photo_id", nextField: "finish" },
        ];

        const onFeed = () => {
            setField(chat_id, "createCardStatus", "name");
            return bot.sendMessage(chat_id, cardTexts.addCardFeedText);
        }
        const onFinish = async () => {
            setStatus(chat_id, "command");
            setField(chat_id, "createCardStatus", undefined);
            await cardDB.createCard(card);
            return bot.sendMessage(chat_id, cardTexts.createCardFinishText);
        }

        const checkValueIsValid = (value) => {
            if (createCardStatus === "photo_id") {
                const photoId = msg.photo?.[0]?.file_id;
                return !!photoId;
            }
            return Number.isInteger(+value);
        }

        if (!userStatus || userStatus === "command") {
            setStatus(chat_id, "admin/create_card")
        }
        if (!createCardStatus) {
            onFeed();
            return;
        }

        for (let createObj of createFields) {
            if (createObj.field === createCardStatus) {
                let value = getText(msg);
                const isValueValid = checkValueIsValid(value);

                if (!isValueValid) {
                    return bot.sendMessage(chat_id, cardTexts.incorrectData)
                }

                if (createCardStatus === "photo_id") {
                    value = msg.photo[0].file_id;
                }

                card[createObj.field] = value;
                setField(chat_id, "createCardStatus", createObj.nextField);
                if (createObj.nextField === "finish") {
                    return onFinish();
                }
                const sendText = cardTexts.sucessAddTexts[createObj.field];
                const sendButtons = buttons[createObj.field];
                return bot.sendMessage(chat_id, sendText, sendButtons);
            }
        }
    }
    async editCard({ chat_id }, msg) {
        const editStatus = getField(chat_id, "editCardStatus");

        if (!editStatus) {
            setField(chat_id, "editCardStatus", "select_card");
            setStatus(chat_id, "admin/edit_card");
            const editCardButtons = await cardButtons.getCardListButtons();
            return bot.sendMessage(chat_id, cardTexts.editCardFeedText, editCardButtons);
        }

        if (editStatus === "select_card") {
            const cardId = getText(msg);
            setField(chat_id, "editCardStatus", "select_field");
            setField(chat_id, "editCardId", cardId);
            const card = await cardDB.getCard(cardId);
            const editCardFieldsButtons = cardButtons.cardFieldsButtons;
            const cardStats = cardTexts.getCardStats(card);
            if (card.file_id) {
                await bot.sendPhoto(chat_id, card.file_id);
            }
            await bot.sendMessage(chat_id, cardStats);
            return bot.sendMessage(chat_id, cardTexts.editCardSelectFieldText, editCardFieldsButtons);
        }
        if (editStatus === "select_field") {
            const field = getText(msg);
            setField(chat_id, "editCardStatus", "update_value");
            setField(chat_id, "editCardField", field);

            const sendText = cardTexts.editCardFieldTexts[field];
            const sendButtons = await cardButtons.editCardButtons();
            return bot.sendMessage(chat_id, sendText, sendButtons[field]);
        }
        if (editStatus === "update_value") {
            const newValue = getText(msg);
            const field = getField(chat_id, "editCardField");
            const cardId = getField(chat_id, "editCardId")

            setField(chat_id, "editCardStatus", undefined);
            setStatus(chat_id, "command");
            await cardDb.editCard(field, newValue, cardId);
            return bot.sendMessage(chat_id, cardTexts.editSuccess);
        }
    }
    async deleteCard({ chat_id }, msg) {
        const userStatus = getField(chat_id, "status");
        if (!userStatus || userStatus === "command") {
            const buttons = await cardButtons.getCardListButtons();
            setStatus(chat_id, "admin/delete_card");
            return bot.sendMessage(chat_id, cardTexts.deleteCardFeedText, buttons);
        }

        const cardId = getText(msg);
        await cardDB.deleteCard(cardId);
        setStatus(chat_id, "command");
        return bot.sendMessage(chat_id, cardTexts.deleteCardSuccessText);
    }
}

module.exports = new CardActions();