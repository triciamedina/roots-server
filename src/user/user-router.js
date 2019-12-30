const express = require('express')
const logger = require('../logger')
const { users } = require('../store')

const userRouter = express.Router()
const bodyParser = express.json()

userRouter
    .route('/user')
    .get((req, res) => {
        res
        .json(users)
    })
    .post(bodyParser, (req, res) => {
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
    })

userRouter
    .route('/user/:id')
    .get((req, res) => {
        const { id } = req.params
        const user = users.find(u => u.id == id)
    
        if(!user) {
            logger.error(`User with id ${id} not found`)
            return res
                .status(404)
                .send('User not found')
        }
    
        res.json(user)
    })

module.exports = userRouter