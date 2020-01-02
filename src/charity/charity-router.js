const express = require('express')
const CharityService = require('./charity-service')
const config = require('../config')
const fetch = require('node-fetch')

const charityRouter = express.Router()
const bodyParser = express.json()

charityRouter
    .get('/', bodyParser, (req, res, next) => {
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

        const queryString = CharityService.formatQueryParams(params)

        CharityService.getCharities().forEach(charity => {
            const url = charity + '?' + queryString

            fetch(url)
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    }
                    throw new Error(response.statusText)
                })
                .then(data => {
                    res.send({ data })
                })
                .catch(next)
        })
    })

module.exports = charityRouter