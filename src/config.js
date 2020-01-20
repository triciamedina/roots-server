module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql:roots@localhost/roots',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    // CLIENT_ORIGIN: '*',
    JWT_SECRET: process.env.JWT_SECRET || 'test-jwt-secret',
    CHARITY_URLS: ['https://api.donorschoose.org/common/json_feed.html'],
    CHARITY_API_KEY: process.env.CHARITY_API_KEY || 'change-this-key',
    PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
    PLAID_PUBLIC_KEY: process.env.PLAID_PUBLIC_KEY,
    PLAID_SECRET: process.env.PLAID_SECRET,
    PLAID_ENV: 'sandbox'
}