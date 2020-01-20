const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch')

function makeUsersArray() {
    return [
        {
            id: 1,
            email: 'test-user1@email.com',
            first_name: 'Test User 1 First Name',
            last_name: 'Test User 1 Last Name',
            password: 'password01',
            created_at: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 2,
            email: 'test-user2@email.com',
            first_name: 'Test User 2 First Name',
            last_name: 'Test User 2 Last Name',
            password: 'password02',
            created_at: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 3,
            email: 'test-user3@email.com',
            first_name: 'Test User 3 First Name',
            last_name: 'Test User 3 Last Name',
            password: 'password03',
            created_at: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 4,
            email: 'test-user4@email.com',
            first_name: 'Test User 4 First Name',
            last_name: 'Test User 4 Last Name',
            password: 'password04',
            created_at: new Date('2029-01-22T16:28:32.615Z'),
        },
    ];
};

function makeDonationsArray() {
    return [
        {
            id: 1,
            user_id: 1,
            amount: 24.99,
            project_name: 'Test Donation 1 Project Name',
            project_description: 'Test Donation 1 Project Description',
            project_url: 'https://project1.com',
            school_name: 'Test Donation 1 School Name',
            image_url: 'https://project1image.com',
            donated_on: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 2,
            user_id: 1,
            amount: 40.44,
            project_name: 'Test Donation 2 Project Name',
            project_description: 'Test Donation 2 Project Description',
            project_url: 'https://project2.com',
            school_name: 'Test Donation 2 School Name',
            image_url: 'https://project2image.com',
            donated_on: new Date('2029-01-22T16:28:32.615Z'),
        },
    ];
};

function makeRoundupsArray() {
    return [
        {
            id: 1,
            user_id: 1,
            account_id: 'Test Roundup 1 Account Id',
            amount: 24.99,
            date: '2020-01-16',
            name: 'Test Roundup 1 Name',
            transaction_id: 'Test Roundup 1 Transaction Id',
            created_at: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 2,
            user_id: 1,
            account_id: 'Test Roundup 2 Account Id',
            amount: 8.99,
            date: '2020-01-16',
            name: 'Test Roundup 2 Name',
            transaction_id: 'Test Roundup 2 Transaction Id',
            created_at: new Date('2029-01-22T16:28:32.615Z'),
        },
    ];
};

function makeRootsFixtures() {
    const testUsers = makeUsersArray();
    const testDonations = makeDonationsArray();
    const testRoundups = makeRoundupsArray();
    return { testUsers, testDonations, testRoundups };
};

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `   
            BEGIN;
            TRUNCATE TABLE roots_users;
            TRUNCATE TABLE roots_donations;
            TRUNCATE TABLE roots_roundups;
            COMMIT;
            `
        )
        .then(() =>
            Promise.all([
                trx.raw(`ALTER SEQUENCE roots_users_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('roots_users_id_seq', 0)`),
                trx.raw(`ALTER SEQUENCE roots_donations_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('roots_donations_id_seq', 0)`),
                trx.raw(`ALTER SEQUENCE roots_roundups_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('roots_roundups_id_seq', 0)`),
            ])
        )
    )
};

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }));

    return db.into('roots_users').insert(preppedUsers)
        .then(() =>
            db.raw(
                `SELECT setval('roots_users_id_seq', ?)`,
                [users[users.length - 1].id],
            )
        )
};

function seedDonations(db, donations) {
    return db.into('roots_donations').insert(donations)
        .then(() =>
            db.raw(
                `SELECT setval('roots_users_id_seq', ?)`,
                [donations[donations.length - 1].id],
            )
        )
};

function seedRoundups(db, roundups) {
    return db.into('roots_roundups').insert(roundups)
        .then(() =>
            db.raw(
                `SELECT setval('roots_roundups_id_seq', ?)`,
                [roundups[roundups.length - 1].id],
            )
        )
};

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.email,
        algorithm: 'HS256'
    });

    return `Bearer ${token}`;
};

function createPublicToken() {
    const requestBody = {
        "public_key": process.env.PLAID_PUBLIC_KEY,
        "institution_id": "ins_3",
        "initial_products": ["transactions"]
    };

    return fetch('https://sandbox.plaid.com/sandbox/public_token/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw new Error(response.statusText)
        })
};

function exchangePublicToken(publicToken) {
    const requestBody = {
        "client_id": process.env.PLAID_CLIENT_ID,
        "secret": process.env.PLAID_SECRET,
        "public_token": publicToken
    };

    return fetch('https://sandbox.plaid.com/item/public_token/exchange', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw new Error(response.statusText)
        })
};

function getAccounts(accessToken) {
    const requestBody = {
        "client_id": process.env.PLAID_CLIENT_ID,
        "secret": process.env.PLAID_SECRET,
        "access_token": accessToken
    };

    return fetch('https://sandbox.plaid.com/accounts/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw new Error(response.statusText)
        })
};

module.exports = {
    makeUsersArray,
    makeRootsFixtures,
    cleanTables,
    seedUsers,
    makeAuthHeader,
    seedDonations,
    seedRoundups,
    createPublicToken,
    exchangePublicToken,
    getAccounts
}