const TelegramBot = require("node-telegram-bot-api");
const { token, userStatusList } = require("./consts");
const { checkUserIsAuth, addNewUser } = require("./db");
const routes = require("./routes");
const adminController = require("./controllers/adminController");
const bot = new TelegramBot(token, { polling: true });
// const myCommands = commands.map(command => ({ command: command.name, description: command.description }))

const checkCommand = (msg) => {
  const chatId = msg?.chat?.id ?? msg?.message?.chat?.id;
  const userStatus = userStatusList.find(el => el.id === chatId)?.status ?? 'command';


  if (userStatus === 'command') {
    const commandText = (msg.text?.split(' ')[0] || msg.data?.split(' ')[0])?.slice(1);
    if (commandText in routes) {
      return routes[commandText](msg, bot);
    } else {
      return bot.sendMessage(chatId, 'Неизвестная команда')
    }
  } else if (userStatus.split(" ")[0] === 'admin/add_universe') {
    return adminController.createUniversity(msg, bot);
  } else if (userStatus.split(" ")[0] === 'admin/edit_universe') {
    return adminController.editUniversityAction(msg, bot);
  } else if (userStatus.split(" ")[0] === 'admin/add_card_name') {
    return adminController.addCardMessage2(msg, bot);
  } else if (userStatus.split(" ")[0] === 'admin/add_card_stats') {
    return adminController.addCardMessage4(msg, bot);
  } else if (userStatus.split(" ")[0] === 'admin/add_card_image') {
    return adminController.addCardImage(msg, bot);
  } else if (userStatus.split(" ")[0] === 'admin/edit_card_field') {
    return adminController.editCardField(msg, bot);
  } else {
    return bot.sendMessage(chatId, 'Неизвестная команда')
  }
}

const start = async () => {
  bot.setMyCommands([]);

  bot.on("message", async (msg) => {
    const isAuth = await checkUserIsAuth(msg.from.id);
    if (!isAuth) {
      await addNewUser(msg.from.id);
    }
    return checkCommand(msg);
  });
  bot.on('callback_query', (msg) => {
    return checkCommand(msg);
  })
};
start();
