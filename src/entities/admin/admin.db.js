const db = require("../../db2");


class CardDb {
    adminList = [6182359419, 6236025818];
    async getCardList() {
        const cards = await db.query('SELECT * FROM card');
        return cards;
    }
}

module.exports = new CardDb();