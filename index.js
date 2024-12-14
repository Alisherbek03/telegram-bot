const TelegramBot = require("node-telegram-bot-api");

const { gameOptions, againOptions } = require("./options");

const token = "SECRET_KEY";

const bot = new TelegramBot(token, { polling: true });

const obj = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Kompyuter 0 dan 9 gacha son o'yladi, siz usha sonni topishga harakat qiling"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  obj[chatId] = randomNumber;
  await bot.sendMessage(chatId, "To'g'ri sonni toping", gameOptions);
};

const bootstrap = () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Bot haqida ma'lumot",
    },
    {
      command: "/info",
      description: "O'zingiz haqingizda ma'lumot",
    },
    {
      command: "/game",
      description: "O'yin o'ynash",
    },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      return bot.sendMessage(
        chatId,
        `Assalomu alaykum xurmatli ${msg.from?.first_name} sizni bu botda ko'rib turganimizda xursandmiz`
      );
    }

    if (text === "/info") {
      await bot.sendPhoto(
        chatId,
        "https://static.vecteezy.com/system/resources/thumbnails/026/525/162/small_2x/lion-animal-isolated-photo.jpg"
      );
      return bot.sendMessage(
        chatId,
        `Sizning telegram username bu ${msg.from?.username}, sizning ismingiz esa ${msg.from?.first_name} ${msg.from?.last_name}`
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }

    bot.sendMessage(chatId, "Uzur men sizning gapingizga tushunmayapman!! ):");
  });

  bot.on("callback_query", (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") {
      return startGame(chatId);
    }

    if (data == obj[chatId]) {
      return bot.sendMessage(
        chatId,
        `Tabriklaymiz siz to'g'ri javob berdingiz, kompyuter ${obj[chatId]} sonni tanlagan edi`
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Siz noto'g'ri son tanladingiz tanlagan soningiz ${data}, kompyuter ${obj[chatId]} sonni tanlagan edi`,
        againOptions
      );
    }
  });
};

bootstrap();
