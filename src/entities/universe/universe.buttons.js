const universeDb = require('./universe.db');

class UniverseButtons {
    async getUniverseButtons() {
        const universeList = await universeDb.getUniverseList();
        const universeButtons = {
            reply_markup: JSON.stringify({
                inline_keyboard: universeList.map(el => ([{
                    text: el.name,
                    callback_data: el.id
                }]))
            })
        }

        return universeButtons;
    }
}

module.exports = new UniverseButtons();