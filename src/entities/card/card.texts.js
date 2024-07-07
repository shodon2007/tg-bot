const cardTexts = {
    incorrectData: "Ты мне фигню подсунул🤡, Повтори еще раз",
    addCardFeedText: "Введите название карты которую хотите создать",
    editCardFeedText: "Выберите карту",
    editCardSelectFieldText: "Выбери поле которое хочешь изменить",
    sucessAddTexts: {
        name: "Имя какое-то гейское ладно, теперь выбери редкость",
        rarity_id: "Вау какой редкий чмо. Теперь выбери аттаку",
        attack: "Вау, чеза качоок. Теперь введи здоровье❤️",
        health: "Крутяк, теперь введи цену карты",
        price: "Крутяк, теперь выбери вселенную",
        universe_id: "Крутая вселенная, теперь выложи фотку",
        photo_id: "А фото горячое. Ты успешно создал карту",
    },
    getCardStats: (card) => {
        return `Название карты: ${card.name},
        Редкость карты: ${card.rarity_name} ${card.rarity_value}%,
        Цена: ${card.price}$
        Вселенная: ${card.universe_name},
        Аттака: ${card.attack},
        Здоровье: ${card.health}
       `
    },
    editCardFieldTexts: {
        name: "Введи новое имя)",
        rarity_id: "Выбери редкость",
        attack: "Введи новую аттаку",
        health: "Введи здоровье",
        price: "Введи цену",
        universe_id: "Выбери вселенное",
        file_id: "Выбери фоточку",
    },
    editSuccess: "Вы успешно изменили поле",
    createCardFinishText: "Ты успешно создал карточку",
    deleteCardFeedText: "Выбери карту которого хочешь удалить",
    deleteCardSuccessText: "Вы успешно удалили карту"
}

module.exports = cardTexts;