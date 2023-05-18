const PORT = 8000;
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.API_KEY;

app.post('/completions', async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            max_tokens: 50,
            temperature: 0.9,
            messages: [{
                role: "user",
                content: req.body.message
            }]
        })

    }
    try{
        const response = await fetch("https://api.openai.com/v1/chat/completions", options)
        const data = await response.json();
        res.send(data);
    } catch (error) {
        console.log(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    }       
);
