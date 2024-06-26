const menuButtons = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Получить карту', callback_data: '/new_card' }, { text: 'Мои карты', callback_data: '/my_card' }],
            [{ text: 'Сменить вселенную', callback_data: '/universe_list' }],
        ]
    })
}

const selectUniverseButtons = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Выбрать вселенную', callback_data: '/universe_list', }],
        ]
    })
}

const adminButtons = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Создать вселенную', callback_data: '/add_universe' }, { text: 'Создать карту', callback_data: '/create_card' },],
            [{ text: 'Редактировать вселенную', callback_data: '/edit_universe' }, { text: 'Редактировать карту', callback_data: '/edit_card' },],
            [{ text: 'Удалить вселенную', callback_data: '/delete_universe' }, { text: 'Удалить карту', callback_data: '/delete_card' },],
            // [{ text: 'Изменить/Добавить/Удалить редкость', callback_data: '/change_rarity', }],
        ]
    })
}

module.exports = {
    menuButtons,
    selectUniverseButtons,
    adminButtons
}