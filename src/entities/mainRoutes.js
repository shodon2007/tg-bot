const cardRoutes = require("./card/card.routes");
const userRoutes = require("./user/user.routes");
const adminRoutes = require("./admin/admin.routes");
const universeRoutes = require("./universe/universe.routes");

const mainRoutes = [
    cardRoutes,
    userRoutes,
    adminRoutes,
    universeRoutes,
]

module.exports = mainRoutes;