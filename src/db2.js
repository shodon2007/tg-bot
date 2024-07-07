const mysql = require('mysql2/promise');

class Database {
    db;
    conn;
    static instance;
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }
        this.connectDatabase();
    }

    async connectDatabase() {
        const conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'tgBot',
            password: 'shodon2007',
        });
        this.conn = conn;
        Database.instance = this;
        this.db = await conn;
    }

    async query(text, params = null) {
        if (!this.db) {
            await this.conn;
        }
        const [res] = await this.db.query(text, params);
        return res;
    }
}

module.exports = new Database();