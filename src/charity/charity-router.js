const express = require('express');
const CharityService = require('./charity-service');
const config = require('../config');
const  { requireAuth } = require('../middleware/jwt-auth');

const charityRouter = express.Router();

charityRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        const { zip, max, index, showSynopsis } = req.query;

        for (const field of ['zip', 'max', 'index', 'showSynopsis']) {
            if (req.query[field] == null) {
                return res.status(400).json({
                    error: `Missing '${field}' in request query`
                })
            }
        };

        const params = {
            APIKey: config.CHARITY_API_KEY,
            zip,
            max,
            index,
            showSynopsis
        };

        const charities = CharityService.getCharities(params);

        Promise.all(charities)
            .then(data => {
                res
                    .status(200)
                    .send({ data })
            })
            .catch(next)
    })

module.exports = charityRouter;