const actions = require('./admin.actions');

const routes = [
    {
        command: "/admin",
        action: actions.adminFeed.bind(actions),
    },
]
module.exports = routes;