const rarityButtons = require("../rarity/rarity.buttons");
const universeButtons = require("../universe/universe.buttons");
const cardDb = require("./card.db");

class CardButtons {
    cardFieldsButtons = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Название', callback_data: `name` }, { text: 'Редкость', callback_data: `rarity_id` }],
                [{ text: 'Атаку', callback_data: `atack` }, { text: 'Здоровье', callback_data: `health` }],
                [{ text: 'Цену', callback_data: `price` }, { text: 'Вселенную', callback_data: `universe_id` }],
                [{ text: 'Картинку', callback_data: `file_id` }],
            ]
        })
    }
    async addCardButtons() {
        const rarityBtns = await rarityButtons.generateRarrityButtons();
        const universeBtns = await universeButtons.getUniverseButtons();

        return {
            name: rarityBtns,
            price: universeBtns,
        }
    }
    async editCardButtons() {
        const rarityBtns = await rarityButtons.generateRarrityButtons();
        const universeBtns = await universeButtons.getUniverseButtons();

        return {
            rarity_id: rarityBtns,
            universe_id: universeBtns,
        }
    }

    async getCardListButtons() {
        const cardList = await cardDb.getCardList();
        const cardButtons = {
            reply_markup: JSON.stringify({
                inline_keyboard: cardList.map(el => ([{
                    text: el.name,
                    callback_data: el.id
                }]))
            })
        }
        return cardButtons;
    }
}

module.exports = new CardButtons();