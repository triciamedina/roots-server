require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const winston = require('winston');

const app = express();

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'info.log'})
    ]
});

if (NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }))
}

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.post('/user', (req, res) => {
    const { email, firstName, lastName, password } = req.body;
    if (!email) {
        return res
            .status(400)
            .send('Email required')
    }
    if (email.length < 6 || email.length > 50) {
        return res
            .status(400)
            .send('Email must be between 6 and 50 characters')
    }
    if (!firstName) {
        return res
            .status(400)
            .send('First name required')
    }
    if (!lastName) {
        return res
            .status(400)
            .send('Last name required')
    }
    if (!password) {
        return res
            .status(400)
            .send('Password required')
    }
    if (password.length < 8 || password.length > 36) {
        return res
            .status(400)
            .send('Password must be between 8 and 36 characters')
    }
    if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
        return res
            .status(400)
            .send('Password must contain at least one digit')
    }
    res.send('All validation passed')
});

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error);
        response = { message: error.message, error }
    }
    res.status(500).json(response);
});

module.exports = app;