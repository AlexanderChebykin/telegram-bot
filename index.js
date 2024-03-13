const { gameOptions, againOptions } = require('./options')
const TelegramApi = require('node-telegram-bot-api')
const token = "7059559291:AAGNb1riAkJDymPz6M1WxegQsEcofrGKBPE"

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю число, а ты должен его отгадать`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = async () => {
    bot.on('message', async msg => {
        bot.setMyCommands([
            { command: '/start', description: 'Начальное приветствие' },
            { command: '/info', description: 'Получить информацию о пользователе' },
            { command: '/game', description: 'Игра угадай число' },
        ])
        const text = msg.text
        const chatId = msg.chat.id
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
            return bot.sendMessage(chatId, 'Добро пожаловать в чатбот Chebot')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/again') {
            console.warn(chatId)
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            bot.sendMessage(chatId, `Ты угадал ${chats[chatId]}`, againOptions)
        } else {
            bot.sendMessage(chatId, `Чат загадал ${chats[chatId]}, не угадал`, againOptions)
        }

    })
}

start()