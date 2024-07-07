const actions = require('./universe.actions');

const routes = [
    {
        command: "/create_universe",
        action: actions.addUniverse.bind(actions),
    },
    {
        command: "admin/create_universe",
        action: actions.addUniverse.bind(actions),
    },
    {
        command: "admin/edit_universe",
        action: actions.editUniverse.bind(actions),
    },
    {
        command: "/edit_universe",
        action: actions.editUniverse.bind(actions),
    },
    {
        command: "/delete_universe",
        action: actions.deleteUniverse.bind(actions),
    },
    {
        command: "admin/delete_universe",
        action: actions.deleteUniverse.bind(actions),
    },
]
module.exports = routes;