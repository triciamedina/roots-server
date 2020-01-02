const express = require('express')
const path = require('path')
const UserService = require('./user-service')
// const  { requireAuth } = require('../middleware/basic-auth')

const userRouter = express.Router()
const bodyParser = express.json()

userRouter
    .post('/', bodyParser, (req, res, next) => {
        const { email, first_name, last_name, password } = req.body

        for (const field of ['email', 'first_name', 'last_name', 'password']) {
            if (!req.body[field]) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        }

        const passwordError = UserService.validatePassword(password)

        if (passwordError) {
            return res.status(400).json({ error: passwordError})
        }

        UserService.hasUserWithEmail(
            req.app.get('db'),
            email,
        )
            .then(hasUserWithEmail => {
                if (hasUserWithEmail) {
                    return res.status(400).json({ error: `Account with this email already exists` })
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

module.exports = userRouter