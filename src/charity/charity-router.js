const express = require('express')
const config = require('../config')

const charitiesRouter = express.Router()
const bodyParser = express.json()

charitiesRouter
    .get('/', bodyParser, (req, res, next) => {
        const charityUrls = config.CHARITY_URLS
        const apiKey = config.CHARITY_API_KEY
        console.log(charityUrls, apiKey)
        res.send('success')
    })

module.exports = charitiesRouter