const express = require('express')
const path = require('path')
const UserService = require('./user-service')
const  { requireAuth } = require('../middleware/jwt-auth')

const userRouter = express.Router()
const bodyParser = express.json()

userRouter
    .route('/')
    .post(bodyParser, (req, res, next) => {
        const { email, first_name, last_name, password } = req.body

        for (const field of ['email', 'first_name', 'last_name', 'password']) {
            if (!req.body[field]) {
                return res
                    .status(400)
                    .json({
                        error: `Missing '${field}' in request body`
                    })
            }
        }

        const passwordError = UserService.validatePassword(password)

        if (passwordError) {
            return res
                .status(400)
                .json({ 
                    error: passwordError
                })
        }

        UserService.hasUserWithEmail(
            req.app.get('db'),
            email,
        )
            .then(hasUserWithEmail => {
                if (hasUserWithEmail) {
                    return res
                        .status(400)
                        .json({ 
                            error: `Account with this email already exists` 
                        })
                }
                
                return UserService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            email,
                            password: hashedPassword,
                            first_name,
                            last_name,
                        }
                        
                        return UserService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(UserService.serializeUser(user))
                            })
                    })
            })
            .catch(next)
    })

userRouter
    .route('/donation')
    .all(requireAuth)
    .all(bodyParser)
    .get((req, res, next) => {
        UserService.getDonationsForUser(
                    req.app.get('db'),
                    req.user.id
                )
                    .then(donations => {
                        res
                            .json(donations.map(UserService.serializeDonation))
                    })
                    .catch(next)
    })
    .post((req, res, next) => {
        // first check if required values are provided in request body (and that they are valid etc.)
        const { 
            body: {
                amount, 
                project_name, 
                project_description, 
                project_url, 
                school_name, 
                image_url
            },
            user: { id }
        } = req

        for (const field of ['amount', 'project_name', 'project_description', 'project_url', 'school_name', 'image_url']) {
            if (req.body[field] == null) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        }

        const newDonation = { 
            amount, 
            project_name, 
            project_description, 
            project_url, 
            school_name, 
            image_url,
            user_id: id
        }

        UserService.insertDonation(
            req.app.get('db'),
            newDonation
        )
            .then(donation => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${donation.id}`))
                    .json(UserService.serializeDonation(donation))
            })
            .catch(next)
    })

module.exports = userRouter