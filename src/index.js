const mainRoutes = require("./entities/mainRoutes");
const { getCommand, getProps, getChatId } = require("./helpers");
const bot = require("./bot");
const userDb = require("./entities/user/user.db");

const findActionFromMainRoutes = (command) => {
  for (let routes of mainRoutes) {
    for (let route of routes) {
      if (route.command === command) {
        return route.action;
      }
    }
  }

  return false;
}
// const TelegramBot = require("node-telegram-bot-api");
// const { token, userStatusList } = require("./consts");
// const { checkUserIsAuth, addNewUser } = require("./db");
// const routes = require("./routes");
// const adminController = require("./controllers/adminController");
// const bot = new TelegramBot(token, { polling: true });
// // const myCommands = commands.map(command => ({ command: command.name, description: command.description }))

// const checkCommand = (msg) => {
//   const chatId = msg?.chat?.id ?? msg?.message?.chat?.id;
//   const userStatus = userStatusList.find(el => el.id === chatId)?.status ?? 'command';


//   if (userStatus === 'command') {
//     const commandText = (msg.text?.split(' ')[0] || msg.data?.split(' ')[0])?.slice(1);
//     if (commandText in routes) {
//       return routes[commandText](msg, bot);
//     } else {
//       return bot.sendMessage(chatId, 'Неизвестная команда')
//     }
//   } else if (userStatus.split(" ")[0] === 'admin/add_universe') {
//     return adminController.createUniversity(msg, bot);
//   } else if (userStatus.split(" ")[0] === 'admin/edit_universe') {
//     return adminController.editUniversityAction(msg, bot);
//   } else if (userStatus.split(" ")[0] === 'admin/add_card_name') {
//     return adminController.addCardMessage2(msg, bot);
//   } else if (userStatus.split(" ")[0] === 'admin/add_card_stats') {
//     return adminController.addCardMessage4(msg, bot);
//   } else if (userStatus.split(" ")[0] === 'admin/add_card_image') {
//     return adminController.addCardImage(msg, bot);
//   } else if (userStatus.split(" ")[0] === 'admin/edit_card_field') {
//     return adminController.editCardField(msg, bot);
//   } else {
//     return bot.sendMessage(chatId, 'Неизвестная команда')
//   }
// }

const commandHandler = (msg) => {
  const command = getCommand(msg);
  const props = getProps(msg) ?? {};
  props.chat_id = getChatId(msg);
  const action = findActionFromMainRoutes(command);
  if (action) {
    try {
      action(props, msg)
    } catch (e) {
      bot.sendMessage(props.chat_id, "Ашибка");
    }
  } else {
    bot.sendMessage(props.chat_id, "Неизвестная команда");
  }
}

const onMessageQuery = async (msg) => {
  const isAuth = await userDb.isUserExists(getChatId(msg));
  if (!isAuth) {
    await userDb.authUser(msg, msg.chat.username);
  }
  commandHandler(msg);
}


const start = async () => {
  bot.setMyCommands([]);

  bot.on("message", onMessageQuery);
  bot.on('callback_query', onMessageQuery)
};
start();