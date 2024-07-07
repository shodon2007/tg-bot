const db = require("../../db2");


class RarityDb {
    async getRarityList() {
        return await db.query("SELECT * FROM rarity");
    }
}

module.exports = new RarityDb();