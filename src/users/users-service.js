const xss = require('xss')
const bcrypt = require('bcryptjs')
const REGEX_NUMBER = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

const UsersService = {
    hasUserWithEmail(db, email) {
        return db('roots_users')
            .where({ email })
            .first()
            .then(user => !!user)
    },
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('roots_users')
            .returning('*')
            .then(([user]) => user)
    },
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters'
        }
        if (password.length > 36) {
            return 'Password must be less than 36 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces'
        }
        if (!REGEX_NUMBER.test(password)) {
            return 'Password must contain at least 1 number'
        }
        return null
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    serializeUser(user) {
        return {
            id: user.id,
            email: xss(user.email),
            first_name: xss(user.first_name),
            last_name: xss(user.last_name),
        }
    }
}

module.exports = UsersService