const jwt = require('jsonwebtoken')
const config = require('../config')
const xss = require('xss')

const DonationService = {
    getUserId(token) {
        const bearerToken = token.slice(7, token.length)
        return jwt.verify(bearerToken, config.JWT_SECRET, {
            algorithms: ['HS256'],
        })
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
                DonationService.getDonationById(db, donation.id)
            )
    },
    serializeDonation(donation) {
        return {
            id: donation.id,
            donated_on: new Date(donation.donated_on),
            amount: Number(donation.amount),
            project_name: xss(donation.project_name),
            project_description: xss(donation.project_description),
            project_url: xss(donation.project_url),
            school_name: xss(donation.school_name),
            image_url: xss(donation.image_url)
        }
    }
}

module.exports = DonationService