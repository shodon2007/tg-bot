const actions = require('./card.actions');

const routes = [
    {
        command: "/delete_card",
        action: actions.deleteCard.bind(actions),
    },
    {
        command: "admin/delete_card",
        action: actions.deleteCard.bind(actions),
    },
    {
        command: "/create_card",
        action: actions.createCard.bind(actions),
    },
    {
        command: "/edit_card",
        action: actions.editCard.bind(actions),
    },
    {
        command: "admin/edit_card",
        action: actions.editCard.bind(actions),
    },
    {
        command: "admin/create_card",
        action: actions.createCard.bind(actions),
    },

]
module.exports = routes;