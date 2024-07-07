const rarityDb = require('./rarity.db');

class RarityButtons {
    async generateRarrityButtons() {
        const rarityList = await rarityDb.getRarityList();
        return {
            reply_markup: JSON.stringify({
                inline_keyboard:
                    rarityList.map(el => (
                        [{
                            text: `${el.nameone} ${el.rarity_value}%`,
                            callback_data: el.id
                        }]
                    ))
            })
        }
    }
}

module.exports = new RarityButtons();