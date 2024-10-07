const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Bot token from environment variable
const token = process.env.BOT_TOKEN;
if (!token) {
    console.error('BOT_TOKEN is not set in environment variables');
    process.exit(1);
}

// Create bot instance
const bot = new TelegramBot(token, { polling: true });

// Logging function
const log = (type, message) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${type.toUpperCase()}: ${message}`);
};

// Handle /start command
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const gameName = 'corestore'; // Set this to your game's short name

    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: 'Play This Game',
                    callback_game: {}
                }],
                [{
                    text: 'Help',
                    callback_data: 'help'
                }]
            ]
        }
    };

    try {
        await bot.sendGame(chatId, gameName, opts);
        log('info', `Game sent to chat ${chatId}`);
    } catch (error) {
        log('error', `Failed to send game: ${error.message}`);
    }
});

// Handle callback queries
bot.on('callback_query', async (query) => {
    try {
        if (query.data === 'help') {
            await bot.answerCallbackQuery(query.id, {
                text: "Help message: How to play the game..."
            });
            log('info', `Help message sent to user ${query.from.id}`);
        } else if (query.game_short_name === 'store') {
            await bot.answerCallbackQuery(query.id, {
                url:"http://t.me/coredappbot/storedapp"
            });
            log('info', `Game URL sent to user ${query.from.id}`);
        }
    } catch (error) {
        log('error', `Error handling callback query: ${error.message}`);
    }
});

// Error handling
bot.on('polling_error', (error) => {
    log('error', `Polling error: ${error.message}`);
});

// Start the bot
log('info', 'Bot is starting...');