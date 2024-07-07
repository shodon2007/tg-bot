const db = require("../../db2");


class CardDb {
    async getCardList() {
        const cards = await db.query('SELECT * FROM card');
        return cards;
    }
    async createCard({ name, rarity_id, attack, health, price, universe_id, photo_id: file_id }) {
        const values = [name, rarity_id, attack, health, price, universe_id, file_id];
        await db.query('INSERT INTO card (name, rarity_id, attack, health, price, universe_id, file_id) VALUES (?, ?, ?, ?, ?, ?, ?)', values);
        return true;
    }
    async getCard(id) {
        const [card] = await db.query(`
            SELECT 
                card.id, 
                card.name, 
                card.attack, 
                card.health, 
                card.price, 
                card.file_id,
                rarity.nameone AS rarity_name,
                rarity.rarity_value AS rarity_value,
                universe.name AS universe_name
            FROM card 
            INNER JOIN rarity ON card.rarity_id = rarity.id 
            INNER JOIN universe ON card.universe_id = universe.id
            WHERE card.id = ?
        `, +id);
        return card;
    }
    async editCard(field, newValue, cardId) {
        await db.query(`UPDATE card SET ${field} = ? WHERE id = ? `, [newValue, cardId]);
    }
    async deleteCard(cardId) {
        await db.query("DELETE FROM card WHERE id = ?", [cardId])
    }
}

module.exports = new CardDb();