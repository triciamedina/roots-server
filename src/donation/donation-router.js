const express = require('express')
const  { requireAuth } = require('../middleware/jwt-auth')
const DonationService = require('./donation-service')
const path = require('path')

const donationRouter = express.Router()
const bodyParser = express.json()

donationRouter
    .route('/')
    .all(requireAuth)
    .post(bodyParser, (req, res, next) => {
        // first check if required values are provided in request body (and that they are valid etc.)
        const { 
            amount, 
            project_name, 
            project_description, 
            project_url, 
            school_name, 
            image_url
        } = req.body

        for (const field of ['amount', 'project_name', 'project_description', 'project_url', 'school_name', 'image_url']) {
            if (req.body[field] == null) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        }

        const authToken = req.get('Authorization') // already verified by requireAuth middleware
        const user_id = DonationService.getUserId(authToken).user_id // get user id from token

        const newDonation = { 
            amount, 
            project_name, 
            project_description, 
            project_url, 
            school_name, 
            image_url,
            user_id
        }

        DonationService.insertDonation(
            req.app.get('db'),
            newDonation
        )
            .then(donation => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${donation.id}`))
                    .json(DonationService.serializeDonation(donation))
            })
            .catch(next)
    })

module.exports = donationRouter