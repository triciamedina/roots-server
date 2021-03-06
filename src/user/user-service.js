const xss = require('xss')
const bcrypt = require('bcryptjs')
const plaid = require('plaid')
const config = require('../config')

const REGEX_INCLUDES_NUMBER = /\d/
const plaidClient = new plaid.Client(
    config.PLAID_CLIENT_ID,
    config.PLAID_SECRET,
    config.PLAID_PUBLIC_KEY,
    plaid.environments[config.PLAID_ENV],
    {version: '2018-05-22'}
)

const UserService = {
    hasUserWithEmail(db, email) {
        return db('roots_users')
            .where({ email })
            .first()
            .then(user => !!user)
    },
    hasUserWithId(db, id) {
        return db('roots_users')
            .where({ id })
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
        if (!REGEX_INCLUDES_NUMBER.test(password)) {
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
            created_at: new Date(user.created_at),
            auto_roundups: (
                (user.auto_roundups === null)
                ? null
                : new Date(user.auto_roundups)
            )
        }
    },
    getUser(db, id) {
        return db
            .from('roots_users')
            .select('*')
            .where({ id })
            .then(([user]) => user)
    },
    getDonationsForUser(db, user_id) {
        return db
            .from('roots_donations AS donations')
            .select(
                'donations.id',
                'donations.donated_on',
                'donations.amount',
                'donations.project_name',
                'donations.project_description',
                'donations.project_url',
                'donations.school_name',
                'donations.image_url',
                db.raw(
                    `date_part('year', donations.donated_on) AS "year"`
                )
            )
            .where('donations.user_id', user_id)
            .orderBy('donations.donated_on', 'desc')
    },
    serializeDonation(donation) {
        return {
            id: donation.id,
            year: donation.year,
            donated_on: new Date(donation.donated_on),
            amount: Number(donation.amount),
            project_name: xss(donation.project_name),
            project_description: xss(donation.project_description),
            project_url: xss(donation.project_url),
            school_name: xss(donation.school_name),
            image_url: xss(donation.image_url)
        }
    },
    getDonationById(db, id) {
        return db
            .from('roots_donations AS don')
            .select(
                'don.id',
                'don.donated_on',
                'don.amount',
                'don.project_name',
                'don.project_description',
                'don.project_url',
                'don.school_name',
                'don.image_url'
            )
            .where('don.id', id)
            .first()
    },
    insertDonation(db, newDonation) {
        return db
            .insert(newDonation)
            .into('roots_donations')
            .returning('*')
            .then(([donation]) => donation)
            .then(donation =>
                UserService.getDonationById(db, donation.id)
            )
    },
    exchangePublicToken(publicToken) {
        return plaidClient.exchangePublicToken(publicToken)
    },
    insertAccessToken(db, newAccessToken) {
        return db
            .insert(newAccessToken)
            .into('roots_access_tokens')
            .returning('*')
            .then(([token]) => token)
    },
    serializeToken(token) {
        return {
            id: token.id
        }
    },
    getAccessTokenForUser(db, user_id) {
        return db
            .from('roots_access_tokens AS tokens')
            .select(
                'tokens.id',
                'tokens.access_token',
                'tokens.item_id',
                'tokens.account_id'
            )
            .where('tokens.user_id', user_id)
            .first()
    },
    getTransactions(accessToken, startDate, endDate, options) {
        return plaidClient.getTransactions(accessToken, startDate, endDate, options)
    },
    insertRoundup(db, newRoundup) {
        return db
            .insert(newRoundup)
            .into('roots_roundups')
            .returning('*')
            .then(([roundup]) => roundup)
    },
    serializeRoundup(roundup) {
        return {
            id: roundup.id,
            user_id: roundup.user_id,
            amount: Number(roundup.amount),
            date: new Date(roundup.date),
            name: xss(roundup.name),
            transaction_id: xss(roundup.transaction_id),
            created_at: new Date(roundup.created_at)
        }
    },
    getRoundupsForUser(db, user_id) {
        return db
            .from('roots_roundups AS roundups')
            .select(
                'roundups.id',
                'roundups.amount',
                'roundups.amount',
                'roundups.date',
                'roundups.name',
                'roundups.transaction_id',
                'roundups.created_at'
            )
            .where('roundups.user_id', user_id)
    },
    updateUser(db, id, userToUpdate) {
        return db
            .from('roots_users')
            .where({ id })
            .update(userToUpdate)
            .returning('*')
    }
}

module.exports = UserService