const mysql = require('mysql2/promise');

// Create the connection to database
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'tgBot',
    password: 'shodon2007',
});

async function addNewUser(userId) {
    try {
        const sql = await conn;
        await sql.query('INSERT INTO user (id) VALUES (?)', userId);
        return true;
    } catch (e) {
        console.log('Ошибка', e)
        return false;
    }
}

async function checkUserIsAuth(userId) {
    const sql = await conn;
    const [users] = await sql.query('SELECT id FROM user WHERE id = ?', userId);
    if (users.length <= 0) {
        return false;
    }
    return true;
}
async function getUniverseList() {
    const sql = await conn;
    const [universeList] = await sql.query('SELECT name, id FROM universe');
    return universeList;
}

async function setUserUniverse(universe_id, userId) {
    const sql = await conn;
    await sql.query('UPDATE user SET universe_id = ? WHERE id = ?', [universe_id, userId])
}

async function deleteCard(id) {
    const sql = await conn;
    await sql.query("DELETE FROM card WHERE id = ?", id);
}

async function editUniverse(id, name) {
    const sql = await conn;
    await sql.query('UPDATE universe SET name = ? WHERE id = ?', [name, id])
}

async function createCard({ name, rarity_id, attack, health, price, universe_id, file_id }) {
    const sql = await conn;
    const values = [name, rarity_id, attack, health, price, universe_id, file_id];
    await sql.query('INSERT INTO card (name, rarity_id, attack, health, price, universe_id, file_id) VALUES (?, ?, ?, ?, ?, ?, ?)', values);
    return true;
}

async function updateFieldCard(field, value, cardId) {
    const sql = await conn;
    await sql.query(`UPDATE card SET ${field} = ? WHERE id = ?`, [value, cardId]);
    return true;
}

async function getAllCards() {
    const sql = await conn;
    const [cards] = await sql.query('SELECT * FROM card');
    return cards;
}

async function getCard(cardId) {
    const sql = await conn;
    const [[card]] = await sql.query('SELECT * FROM card WHERE id = ?', cardId);
    const [[rarity]] = await sql.query('SELECT * from rarity WHERE id = ?', card.rarity_id);
    const [[universe]] = await sql.query('SELECT * FROM universe WHERE id = ?', card.universe_id);
    card.rarity = rarity;
    card.universe = universe;
    return card;
}

async function deleteUniverse(id) {
    const sql = await conn;
    await sql.query('UPDATE user SET universe_id = NULL WHERE universe_id = ?', id);
    await sql.query('DELETE FROM universe WHERE id = ?', [+id])
}

async function getUniverse(universe_id) {
    const sql = await conn;
    const [[universe]] = await sql.query('SELECT name FROM universe WHERE id = ?', [universe_id]);
    return universe;
}

function rarityFn(rarityList) {
    const randomNumber = Math.random();
    let theMostRarity = null;
    const rarityEl = rarityList.reduce((prev, curr) => {
        if (!theMostRarity || curr.rarity_value > theMostRarity.rarity_value) {
            theMostRarity = curr;
        }
        if (curr.rarity_value / 100 <= randomNumber) {
            if (!prev) {
                return curr;
            }

            return curr.rarity_value > prev.rarity_value ? curr : prev;
        }
        return prev;
    }, null);
    if (rarityEl === null) {
        rarityEl = theMostRarity
    }

    return rarityEl;
}

async function getRarityList() {
    const sql = await conn;
    const [rarityList] = await sql.query("SELECT * FROM rarity");
    return rarityList;
}

async function getRarityItem(userId) {
    const sql = await conn;
    const [rarityList] = await sql.query('SELECT * FROM rarity');
    const [[user]] = await sql.query('SELECT universe_id FROM user WHERE id = ?', userId);


    const rarityEl = rarityFn(rarityList);

    const [userCards] = await sql.query('SELECT * from user_card INNER JOIN card ON card.id = card_id WHERE user_card.user_id = ? AND card.rarity_id = ? AND card.universe_id = ?', [userId, rarityEl.id, user.universe_id]);
    console.log(userCards);


    return rarityEl;
}

module.exports = {
    conn,
    addNewUser,
    checkUserIsAuth,
    getUniverseList,
    setUserUniverse,
    getRarityItem,
    getUniverse,
    editUniverse,
    deleteUniverse,
    getRarityList,
    createCard,
    getAllCards,
    getCard,
    updateFieldCard,
    deleteCard
};