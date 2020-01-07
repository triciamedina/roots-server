require('dotenv').config()

// Q: How do you update postgrator config so that it looks for /db/migrations ?

module.exports = {
    "migrationDirectory": "db/migrations",
    "driver": "pg",
    "connectionString": (process.env.NODE_ENV === 'test')
        ? process.env.TEST_DATABASE_URL
        : process.env.DATABASE_URL,
    "ssl": !!process.env.SSL,
}