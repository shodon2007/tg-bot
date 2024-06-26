const { userStatusList, admins, token } = require("../consts");
const { conn, getUniverseList, getUniverse, editUniverse, deleteUniverse, getRarityItem, getRarityList, createCard, getAllCards, updateFieldCard, getCard, deleteCard } = require("../db");
const { adminButtons } = require("../buttons");
const { setStatus, setField, getField } = require("../helpers");

class AdminController {
    async dontClickBro(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        bot.sendMessage(chatId, 'Говорил же, не тыкать')
    }
    async createUniversity(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const db = await conn;
        await db.query("INSERT INTO universe (name) VALUES (?)", msg.text);
        setStatus(chatId, "command");
        bot.sendMessage(chatId, "ахринеть, Ты успешно создал вселенную")
    }
    async addCardMessage1(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        setStatus(chatId, "admin/add_card_name");
        bot.sendMessage(chatId, "Введите название карты которую хотите создать");
    }
    async addCardMessage2(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const cardName = msg.text;
        setField(chatId, "user", {
            name: cardName,
        });
        const rarityList = await getRarityList();
        const buttons = {
            reply_markup: JSON.stringify({
                inline_keyboard: rarityList.map(el => ([{ text: `${el.nameone} ${el.rarity_value}%`, callback_data: `/add_card_rarity ${el.id}` }]))
            })
        }
        setStatus(chatId, "command");
        bot.sendMessage(chatId, "Выберите случайность карты", buttons)
    }
    async addCardMessage3(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const rarityIndex = msg.data?.split(" ")[1] || msg.text.split(" ")[1];
        setField(chatId, "user", {
            ...getField(chatId, "user"),
            rarity_id: rarityIndex,
        });
        setStatus(chatId, "admin/add_card_stats");
        bot.sendMessage(chatId, 'Окей, теперь введи какая у карты атака⚔️ ')
    }
    async addCardUniverse(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const user = getField(chatId, "user");
        const universeId = msg.data?.split(' ')[1] ?? msg.data?.split(' ')[1];
        user.universe_id = universeId;
        bot.sendMessage(chatId, "вселенная просто перфект, теперь выложи фоточку этой карты");
        setStatus(chatId, 'admin/add_card_image');
    }
    async addCardImage(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const photoId = msg.photo?.[0]?.file_id;

        if (!photoId) {
            return bot.sendMessage(chatId, "ты мне фигню впариваешь")
        }

        const user = getField(chatId, "user");
        const fileId = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${photoId}`).then(res => res.json()).then(res => res.result.file_id);
        user.file_id = fileId;
        await createCard(user);
        setField(chatId, "user", {});
        setField(chatId, "status", "command");
        bot.sendMessage(chatId, "Ты успешно создал карточку)");
    }
    async addCardMessage4(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const universeList = await getUniverseList();
        const universeButtons = {
            reply_markup: JSON.stringify({
                inline_keyboard: universeList.map(el => ([{ text: el.name, callback_data: `/add_card_universe ${el.id}` }]))
            })
        }
        const value = msg.text || msg.data;
        const user = getField(chatId, "user");

        if (!("attack" in user)) {
            const isCorrectData = Number.isInteger(+value);
            if (isCorrectData) {
                user.attack = value;
                bot.sendMessage(chatId, "Крутяк, теперь введи здоровье❤️");
            } else {
                bot.sendMessage(chatId, "Ты мне фигню подсунул🤡, Повтори еще раз")
            }
        } else if (!("health" in user)) {
            const isCorrectData = Number.isInteger(+value);
            if (isCorrectData) {
                user.health = value;
                bot.sendMessage(chatId, "Крутяк, теперь введи цену карты");
            } else {
                bot.sendMessage(chatId, "Ты мне фигню подсунул🤡, Повтори еще раз")
            }
        } else if (!("price" in user)) {
            const isCorrectData = Number.isInteger(+value);
            if (isCorrectData) {
                user.price = value;
                bot.sendMessage(chatId, "Крутяк, теперь выбери вселенную", universeButtons);
                setStatus(chatId, 'command');
            } else {
                bot.sendMessage(chatId, "Ты мне фигню подсунул🤡, Повтори еще раз")
            }
        } else {
            setStatus(chatId, 'command');
            bot.sendMessage(chatId, "Крутяк, теперь выбери вселенную", universeButtons);
        }
    }
    async editUniversityMenu(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const universeList = await getUniverseList();
        const buttons = {
            reply_markup: JSON.stringify({
                inline_keyboard: universeList.map(el => ([{ text: el.name, callback_data: `/select_edit_universe ${el.id}` }]))
            })
        }
        bot.sendMessage(chatId, 'Выберите вселенную для редактирования', buttons);
    }
    async editUniversityName(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const universeId = msg.data?.split(' ')[1] ?? msg.data?.split(' ')[1];
        const universe = await getUniverse(universeId);
        if (!universeId || Number.isNaN(universeId)) {
            return bot.sendMessage(chatId, 'Неправильный выбор вселенной')
        }
        setStatus(chatId, `admin/edit_universe ${universeId}`)
        bot.sendMessage(chatId, `Введите новое имя для вселенной "${universe.name}"`,);
    }
    async editUniversityAction(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const userStatus = userStatusList.find(el => el.id === chatId);
        const editUniverseId = userStatus.status.split(" ")[1];
        const oldUniverse = await getUniverse(editUniverseId);
        const newName = msg.text;
        await editUniverse(editUniverseId, newName);
        userStatus.status = "command";
        bot.sendMessage(chatId, `Вселенная "${oldUniverse.name}" успешно изменена на "${newName}"`,);
    }
    async deleteUniverseMenu(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const universeList = await getUniverseList();
        const buttons = {
            reply_markup: JSON.stringify({
                inline_keyboard: universeList.map(el => ([{ text: el.name, callback_data: `/select_delete_universe ${el.id}` }]))
            })
        }
        bot.sendMessage(chatId, 'Выберите вселенную для удаления)', buttons);
    }
    async deleteUniverseAction(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        try {
            const deleteUniverseId = msg.data.split(" ")[1];
            const universe = await getUniverse(deleteUniverseId);
            await deleteUniverse(deleteUniverseId);
            bot.sendMessage(chatId, `Вселенная "${universe.name}" нафиг удалилась`);
        } catch (e) {
            console.log(e);
            bot.sendMessage(chatId, "Не удалось удалить")
        }
    }
    async adminMenu(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const isAdmin = admins.includes(chatId);
        if (isAdmin) {
            return await bot.sendMessage(chatId, `Здарова ${msg.from.first_name}, ты крутой админ.`, adminButtons)
        } else {
            return await bot.sendMessage(chatId, `Здарова ${msg.from.first_name}, ты нихера не админ.`)
        }
    }
    async addUniverseMessage(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        setStatus(chatId, 'admin/add_universe');
        bot.sendMessage(chatId, `Напишите название вселенной`)
    }
    async editCardField(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const fields = getField(chatId, "status");
        const field = fields.split(' ')[1] ?? fields.split(' ')[1];
        const cardId = fields.split(' ')[2] ?? fields.split(' ')[2];
        let value;

        if (field === "file_id") {
            const photoId = msg.photo?.[0]?.file_id;
            const fileId = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${photoId}`).then(res => res.json()).then(res => res.result.file_id);
            value = fileId;
        } else {
            value = msg.text || msg.data;;
        }

        await updateFieldCard(field, value, cardId);
        setStatus(chatId, "command");
        bot.sendMessage(chatId, "Вы успешно отредачили поле");
    }
    async editCardItem(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const field = msg.data?.split(' ')[1] ?? msg.data?.split(' ')[1];
        const cardId = msg.data?.split(' ')[2] ?? msg.data?.split(' ')[2];

        setStatus(chatId, `admin/edit_card_field ${field} ${cardId}`);
        switch (field) {
            case 'name':
                bot.sendMessage(chatId, "Введите новое имя");
                break;
            case 'attack':
                bot.sendMessage(chatId, "Введите новую атаку");
                break;
            case 'price':
                bot.sendMessage(chatId, "Введите новую цену");
                break;
            case 'file_id':
                bot.sendMessage(chatId, "Вставьте новую картинку сюда");
                break;
            case 'rarity_id':
                const rarityList = await getRarityList();
                const rarityButtons = {
                    reply_markup: JSON.stringify({
                        inline_keyboard: rarityList.map(el => ([{ text: `${el.nameone} ${el.rarity_value}%`, callback_data: el.id }]))
                    })
                }
                bot.sendMessage(chatId, "Выберите новую редкость из списка", rarityButtons);
                break;
            case 'health':
                bot.sendMessage(chatId, "Введите новое здоровье");
                break;
            case 'universe_id':
                const universeList = await getUniverseList();
                const universeButtons = {
                    reply_markup: JSON.stringify({
                        inline_keyboard: universeList.map(el => ([{ text: el.name, callback_data: el.id }]))
                    })
                }
                bot.sendMessage(chatId, "Введите новую вселенную", universeButtons);
                break;
        }
    }
    async editCardItemMenu(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const cardId = msg.data?.split(' ')[1] ?? msg.data?.split(' ')[1];
        const card = await getCard(cardId);
        const buttons = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: 'Название', callback_data: `/edit_card_item name ${cardId}` }, { text: 'Редкость', callback_data: `/edit_card_item rarity_id ${cardId}` }],
                    [{ text: 'Атаку', callback_data: `/edit_card_item attack ${cardId}` }, { text: 'Здоровье', callback_data: `/edit_card_item health ${cardId}` }],
                    [{ text: 'Цену', callback_data: `/edit_card_item price ${cardId}` }, { text: 'Вселенную', callback_data: `/edit_card_item universe_id ${cardId}` }],
                    [{ text: 'Картинку', callback_data: `/edit_card_item file_id ${cardId}` }],
                ]
            })
        }
        const cardMessage = `       Название карты: ${card.name},
        Редкость карты: ${card.rarity.name} ${card.rarity.rarity_value}%,
        Цена: ${card.price}$
        Вселенная: ${card.universe.name},
        Аттака: ${card.attack},
        Здоровье: ${card.health}
        `

        await bot.sendPhoto(chatId, card.file_id);
        await bot.sendMessage(chatId, cardMessage);
        bot.sendMessage(chatId, "Выбери поле которое хотите изменить", buttons);
    }
    async editCardMenu(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const cards = await getAllCards();
        const buttons = {
            reply_markup: JSON.stringify({
                inline_keyboard: cards.map(el => ([{ text: el.name, callback_data: `/select_edit_card ${el.id}` }]))
            })
        }
        bot.sendMessage(chatId, 'Выбери карту из списка которого хочешь редактировать', buttons);
    }
    async deleteCardMenu(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const cards = await getAllCards();
        const buttons = {
            reply_markup: JSON.stringify({
                inline_keyboard: cards.map(el => ([{ text: el.name, callback_data: `/select_delete_card ${el.id}` }]))
            })
        }
        bot.sendMessage(chatId, 'Выбери карту из списка которого хочешь удалить', buttons);
    }
    async deleteCardAction(msg, bot) {
        const chatId = msg.chat?.id ?? msg.message.chat.id;
        const cardId = msg.data?.split(' ')[1] ?? msg.data?.split(' ')[1];
        await deleteCard(cardId);
        bot.sendMessage(chatId, 'Вы успешно удалили карточку');
    }
}

module.exports = new AdminController();