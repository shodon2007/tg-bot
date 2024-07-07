const actions = require('./user.actions');

const routes = [
    {
        command: "/start",
        action: actions.startMessage.bind(actions),
    },
]

module.exports = routes;