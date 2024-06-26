const adminController = require("./controllers/adminController");
const userController = require("./controllers/userController");

const routes = {
    dont_click_bro: adminController.dontClickBro,
    start: userController.start,
    admin: adminController.adminMenu,
    universe_list: userController.selectUniverseMenu,
    select_universe: userController.selectUniverseAction,
    add_universe: adminController.addUniverseMessage,
    new_card: userController.getNewCard,
    edit_universe: adminController.editUniversityMenu,
    delete_universe: adminController.deleteUniverseMenu,
    select_edit_universe: adminController.editUniversityName,
    select_delete_universe: adminController.deleteUniverseAction,
    create_card: adminController.addCardMessage1,
    add_card_rarity: adminController.addCardMessage3,
    add_card_universe: adminController.addCardUniverse,
    edit_card: adminController.editCardMenu,
    edit_card_item: adminController.editCardItem,
    select_edit_card: adminController.editCardItemMenu,
    delete_card: adminController.deleteCardMenu,
    select_delete_card: adminController.deleteCardAction,
}

module.exports = routes;