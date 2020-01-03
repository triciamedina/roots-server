const express = require('express')
const CharityService = require('./charity-service')
const config = require('../config')
const  { requireAuth } = require('../middleware/jwt-auth')

const charityRouter = express.Router()
const bodyParser = express.json()

charityRouter
    .route('/')
    .get(requireAuth, bodyParser, (req, res, next) => {
        const { zip, max, index } = req.body

        for (const field of ['zip', 'max', 'index']) {
            if (req.body[field] == null) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        }

        const params = {
            APIKey: config.CHARITY_API_KEY,
            zip,
            max,
            index
        }

        const charities = CharityService.getCharities(params)

        Promise.all(charities)
            .then(data => {
                res.send({ data })
            })
            .catch(next)
    })

module.exports = charityRouter