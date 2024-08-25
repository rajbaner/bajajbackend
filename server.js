const express = require('express');
const Joi = require('joi');
const morgan = require('morgan');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(morgan('combined')); // Middleware for logging

// Input validation schema using Joi
const schema = Joi.object({
    data: Joi.array().items(
        Joi.string().pattern(/^[a-zA-Z]$/).optional(),
        Joi.string().pattern(/^\d+$/).optional()
    ).required()
});

// POST route for /bfhl
app.post('/bfhl', (req, res) => {
    try {
        const { error, value } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({
                is_success: false,
                message: 'Invalid input',
                error: error.details[0].message
            });
        }

        const { data } = value;
        const user_id = 'john_doe_17091999'; 
        const email = 'john@xyz.com'; 
        const roll_number = 'ABCD123'; 

        const numbers = [];
        const alphabets = [];
        let highestLowercaseAlphabet = '';

        data.forEach(item => {
            if (!isNaN(item)) {
                numbers.push(item);
            } else if (/^[a-zA-Z]$/.test(item)) {
                alphabets.push(item);
                if (item === item.toLowerCase() && item > highestLowercaseAlphabet) {
                    highestLowercaseAlphabet = item;
                }
            }
        });

        res.json({
            is_success: true,
            user_id,
            email,
            roll_number,
            numbers,
            alphabets,
            highest_lowercase_alphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : []
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            is_success: false,
            message: 'An unexpected error occurred'
        });
    }
});

// GET route for /bfhl
app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// Handle root path
app.get('/', (req, res) => {
    res.status(200).send('Welcome to the API. Use /bfhl for the endpoints.');
});

// Listen on the appropriate port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

