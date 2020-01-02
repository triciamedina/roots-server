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
    .route('/:user_id/donation')
    .all(requireAuth)
    .get(bodyParser, (req, res, next) => {

        UserService.hasUserWithId(
            req.app.get('db'),
            req.params.user_id,
        )
            .then(hasUserWithId => {
                if (!hasUserWithId) {
                    return res
                        .status(404)
                        .json({ 
                            error: `User doesn't exist` 
                        })
                }

                return UserService.getDonationsForUser(
                    req.app.get('db'),
                    req.params.user_id
                )
                    .then(donations => {
                        res
                            .json(donations.map(UserService.serializeDonation))
                    })
                    .catch(next)
            })
    })

module.exports = userRouter