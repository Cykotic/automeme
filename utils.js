const {
    EmbedBuilder,
    WebhookClient
} = require("discord.js");
const fetch = require('node-fetch');

// can add more to this
const MEME_ENDPOINTS = [
    'https://www.reddit.com/r/memes/random.json',
    "https://www.reddit.com/r/dankmemes/random.json",
    "https://www.reddit.com/r/Funnymemes/random.json",
    "https://www.reddit.com/r/wholesomememes/random.json",
    "https://www.reddit.com/r/meme/random.json",
    "https://www.reddit.com/r/anxietymemes/random.json",
    "https://www.reddit.com/r/pcmemes/random.json"
];

async function fetchMeme() {
    try {
        const randomEndpoint = MEME_ENDPOINTS[Math.floor(Math.random() * MEME_ENDPOINTS.length)];
        const response = await fetch(randomEndpoint);
        const memeData = await response.json();

        if (memeData && memeData[0] && memeData[0].data.children[0].data) {
            const {
                url,
                title,
                ups,
                num_comments,
                permalink
            } = memeData[0].data.children[0].data;

            const embed = new EmbedBuilder()
                .setColor("Orange")
                .setTitle(title)
                .setURL(`https://www.reddit.com${permalink}`)
                .setImage(url)
                .setFooter({
                    text: `👍 ${ups}  |  💬 ${num_comments || 0}`
                });

            return embed;
        } else {
            throw new Error('Failed to fetch a meme.');
        }
    } catch (error) {
        console.error('Error fetching meme:', error);
        throw error; // Rethrow the error for the caller to handle
    }
}

async function sendMemeToChannel(webhookURL) {
    try {
        if (!webhookURL) {
            throw new Error('Webhook URL is not provided.');
        }

        const embed = await fetchMeme();
        if (!embed) return;

        const webhook = new WebhookClient({
            url: webhookURL
        });
        await webhook.send({
            embeds: [embed]
        });
    } catch (error) {
        console.error('Error sending meme:', error);
        // Handle the error, reply to user, etc.
    }
}

module.exports = {
    sendMemeToChannel
};