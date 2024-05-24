const TelegramBot = require("node-telegram-bot-api");
const token = "6492506452:AAF2VUcvZWohyA2P4CvWZE9Z1jlI1RiehAA";

const bot = new TelegramBot(token, { polling: true });

const start = () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Начать чатится с этим ботом",
    },
    {
      command: "/info",
      description: "Не тыкай эту кнопку😡",
    },
  ]);

  bot.on("message", (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Ты че "${text}" написал😡`);
    console.log(msg);
  });
};

start();
