const db = require("../../db2");


class UserDb {
    constructor() {
        this.db = db;
    }
    async isUserExists(userId) {
        const [{ count }] = await this.db.query('SELECT COUNT(id) AS count FROM user WHERE id = ?', [userId]);
        return !!count;
    }

    async authUser(user_id, username) {
        try {
            await this.db.query('INSERT INTO user (id, username) VALUES (?, ?)', [user_id, username]);
            return true;
        } catch (e) {
            return false;
        }
    }
}

module.exports = new UserDb();