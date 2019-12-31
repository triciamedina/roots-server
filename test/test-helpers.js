const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')

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
    ]
}

function makeRootsFixtures() {
    const testUsers = makeUsersArray()
    return { testUsers }
}

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
                roots_users
                `
        )
        .then(() =>
            Promise.all([
                trx.raw(`ALTER SEQUENCE roots_users_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('roots_users_id_seq', 0)`),
            ])
        )
    )
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('roots_users').insert(preppedUsers)
        .then(() =>
            db.raw(
                `SELECT setval('roots_users_id_seq', ?)`,
                [users[users.length - 1].id],
            )
        )
}

// function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
//     const token = jwt.sign({ user_id: user.id }, secret, {
//         subject: user.email,
//         algorithm: 'HS256'
//     })
//     return `Bearer ${token}`
// }

module.exports = {
    makeUsersArray,
    makeRootsFixtures,
    cleanTables,
    seedUsers,
}