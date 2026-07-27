const express = require('express');
const router = express.Router();

const rateLimits = new Map();

router.post('/contact', async (req, res) => {
    const ip = req.ip;
    const now = Date.now();
    
    if (rateLimits.has(ip)) {
        const lastSent = rateLimits.get(ip);
        if (now - lastSent < 5 * 60 * 1000) { // 5 minutes
            return res.status(429).json({ error: 'Please wait 5 minutes before sending another message.' });
        }
    }
    
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
    }
    
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!token || !chatId) {
        return res.status(500).json({ error: 'Telegram configuration is missing.' });
    }
    
    const text = `New Contact Form Submission:
Name: ${name}
Email: ${email}
Subject: ${subject || 'No Subject'}
Message: ${message}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text
            })
        });
        
        if (response.ok) {
            rateLimits.set(ip, now);
            res.json({ success: true });
        } else {
            const data = await response.json();
            console.error('Telegram API error:', data);
            res.status(500).json({ error: 'Failed to send message.' });
        }
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
