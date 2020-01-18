const express = require('express')
const path = require('path')
const moment = require('moment')
const UserService = require('./user-service')
const  { requireAuth } = require('../middleware/jwt-auth')

const userRouter = express.Router()
const bodyParser = express.json()

userRouter
    .route('/')
    .all(bodyParser)
    .post((req, res, next) => {
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
    .get(requireAuth, (req, res, next) => {
        UserService.getUser(
            req.app.get('db'),
            req.user.id
        )
            .then(user => {
                res
                    .status(200)
                    .json(UserService.serializeUser(user))
            })
            .catch(next)
    })
    .patch(requireAuth, (req, res, next) => {
        const { autoRoundups } = req.body

        let auto_roundups;

        if (autoRoundups === null) {
            return res
                .status(400)
                .json({
                    error: `Missing autoRoundups in request body`
                })
        };

        if (autoRoundups === true) {
            auto_roundups = new Date();
        };
        if (autoRoundups === false) {
            auto_roundups = null;
        };

        const userToUpdate = {
            auto_roundups
        };
    
        UserService.updateUser(
            req.app.get('db'),
            req.user.id,
            userToUpdate
        )
            .then(user => {
                res
                    .status(200)
                    .json(UserService.serializeUser(user[0]))
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
            req.user.id // id is set by jwt-auth middleware
        )
            .then(donations => {
                res
                    .status(200)
                    .json(donations.map(UserService.serializeDonation))
            })
            .catch(next)
    })
    .post((req, res, next) => {
        const { 
            body: {
                amount, 
                project_name, 
                project_description, 
                project_url, 
                school_name, 
                image_url
            },
            user: { id } // id is set by jwt-auth middleware
        } = req

        // TODO: check that provided values are valid

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

userRouter
    .route('/account')
    .all(requireAuth)
    .all(bodyParser)
    .post((req, res, next) => {
        const { 
            body: {
                publicToken,
                accountId
            },
            user: { id } // id is set by jwt-auth middleware
        } = req

        for (const field of ['publicToken']) {
            if (req.body[field] == null) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        }

        UserService.exchangePublicToken(publicToken)
            .then(response =>  {
                
                const { access_token, item_id } = response
                const newAccessToken = {
                    access_token,
                    item_id,
                    user_id: id,
                    account_id: accountId
                }

                return UserService.insertAccessToken(
                    req.app.get('db'),
                    newAccessToken
                )     
                    .then(token => {
                        res
                            .status(201)
                            .location(path.posix.join(req.originalUrl, `/${token.id}`))
                            .json(UserService.serializeToken(token))
                    })
        })
        .catch(next)
    })
    .get((req, res, next) => {
        UserService.getAccessTokenForUser(
            req.app.get('db'),
            req.user.id
        )
            .then(token => {
                if (!token) {
                    return null
                }
                
                res.json(UserService.serializeToken(token))
                })
    })

userRouter
    .route('/transaction')
    .all(requireAuth)
    .get((req, res, next) => {
        UserService.getAccessTokenForUser(
            req.app.get('db'),
            req.user.id
        )
            .then(token => {
                if (!token) {
                    return res.status(400).json({
                        error: `Account does not exist`
                    })
                }
                const accessToken = token.access_token
                const accountId = token.account_id
                const today = moment().format('YYYY-MM-DD')
                const thirtyDaysAgo = moment().subtract(30, 'days').format('YYYY-MM-DD')

                return UserService.getTransactions(accessToken, thirtyDaysAgo, today, { account_ids: [accountId] })
                    .then(data => {
                        res.json(data)
                    })
            })
            .catch(next)
    })

userRouter
    .route('/roundup')
    .all(requireAuth)
    .all(bodyParser)
    .post((req, res, next) => {
        const { account_id, amount, date, name, transaction_id } = req.body

        for (const field of ['account_id', 'amount', 'date', 'name', 'transaction_id']) {
            if (req.body[field] == null) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        }

        const newRoundup = {
            account_id,
            amount,
            date,
            name,
            transaction_id,
            user_id: req.user.id
        }

        UserService.insertRoundup(
            req.app.get('db'),
            newRoundup
        )
            .then(roundup => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${roundup.id}`))
                    .json(UserService.serializeRoundup(roundup))
            })
            .catch(next)
    })
    .get((req, res, next) => {
        UserService.getRoundupsForUser(
            req.app.get('db'),
            req.user.id 
        )
            .then(roundups => {
                res
                    .json(roundups.map(UserService.serializeRoundup))
            })
            .catch(next)
    })

module.exports = userRouter