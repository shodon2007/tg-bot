const db = require("../../db2");


class UniverseDb {
    async getUniverseList() {
        return await db.query('SELECT name, id FROM universe');
    }
    async createUniverse(name) {
        return await db.query("INSERT INTO universe(name) VALUES (?)", [name]);
    }
    async editUniverse(name, universeId) {
        return await db.query('UPDATE universe SET name = ? WHERE id = ?', [name, universeId])
    }
    async deleteUniverse(universeId) {
        return await db.query("DELETE FROM universe WHERE id = ?", [universeId]);
    }
}

module.exports = new UniverseDb();