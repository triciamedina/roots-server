const xss = require('xss')
const bcrypt = require('bcryptjs')
const REGEX_NUMBER = /^(?=.*\d)[A-Za-z\d]{8,}$/

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
            created_at: new Date(user.created_at)
        }
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
            // .groupBy('year', 'donations.id')
            .orderBy('donations.donated_on', 'desc')
            //  select datepart(yyyy, [donations.donated_on]) as [year] (creating calculated column)
            //  order by date descending
            //  group by year
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
}

module.exports = UserService