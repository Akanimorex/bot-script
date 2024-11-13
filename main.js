const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

// Bot token from environment variable
const token = process.env.BOT_TOKEN;
if (!token) {
    console.error('BOT_TOKEN is not set in environment variables');
    process.exit(1);
}

// Create bot instance
const bot = new Telegraf(token);

// Logging function
const log = (type, message) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${type.toUpperCase()}: ${message}`);
};

// Handle /start command
bot.start(async (ctx) => {
    const gameUrl = 'https://guess-game-mu-snowy.vercel.app/'; 

    

   const opts = Markup.inlineKeyboard([
        [
            Markup.button.webApp('Play This Game', gameUrl), // WebApp button
            Markup.button.callback('Help', 'help') // Callback button for help
        ]
        ])

    try {
        await ctx.reply('Welcome! Click the button below to play the game.', opts);
        log('info', `Game link sent to chat ${ctx.chat.id}`);
    } catch (error) {
        log('error', `Failed to send game link: ${error.message}`);
    }
});

// Handle callback queries
bot.on('callback_query', async (ctx) => {
    const query = ctx.callbackQuery;

    try {
        if (query.data === 'help') {
            await ctx.answerCbQuery("Help message: How to play the game...");
            log('info', `Help message sent to user ${query.from.id}`);
        }
    } catch (error) {
        log('error', `Error handling callback query: ${error.message}`);
    }
});

// Error handling
bot.catch((error, ctx) => {
    log('error', `Error for ${ctx.updateType}: ${error.message}`);
});

// Start the bot
bot.launch();
log('info', 'Bot is starting...');
