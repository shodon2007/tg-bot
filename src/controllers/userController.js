const { menuButtons, selectUniverseButtons } = require("../buttons");
const fs = require('fs');
const path = require('path');
const { conn, getUniverseList, setUserUniverse, getRarityItem, getUniverse } = require("../db");
const { imagesPath } = require("../consts");

class UserController {
    async start(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const sql = await conn;
        let buttons = menuButtons;
        const [[{ universe_id }]] = await sql.query('SELECT universe_id FROM user WHERE id = ?', msg.from.id);
        if (universe_id === null) {
            buttons = selectUniverseButtons
        }
        return await bot.sendMessage(chatId, `${msg.from.first_name}, добро пожаловать во вселенную Super puper mega card

      🃏 Цель игры в коллекционировании карточек. Собирай карточки и борись за место в топе
      
      🌏 Вселенные будут постоянно обновляться и улучшаться`, buttons);
    }
    async selectUniverseMenu(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const universeList = await getUniverseList();
        const buttons = {
            reply_markup: JSON.stringify({
                inline_keyboard: universeList.map(el => ([{ text: el.name, callback_data: `/select_universe ${el.id}` }]))
            })
        }
        bot.sendMessage(chatId, 'Выберите вселенную', buttons);
    }
    async selectUniverseAction(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const universeId = msg.data?.split(' ')[1] ?? msg.data?.split(' ')[1];
        if (!universeId || Number.isNaN(universeId)) {
            return bot.sendMessage(chatId, 'Неправильный выбор вселенной')
        }
        await setUserUniverse(universeId, chatId);
        const universe = await getUniverse(universeId);
        bot.sendMessage(chatId, `Вы успешно выбрали вселенную "${universe.name}"`)
    }
    async getNewCard(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const image = fs.readFileSync(path.resolve(imagesPath, 'photo1.jpg'));
        let item = await getRarityItem(chatId);

        await bot.sendPhoto(chatId, image);
        await bot.sendMessage(chatId, 'Бро я пока не сделал выбор карты');
    }
}

module.exports = new UserController();