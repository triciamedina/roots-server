module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql:roots@localhost/roots',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'change-this',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    CHARITY_URLS: ['https://api.donorschoose.org/common/json_feed.html'],
    CHARITY_API_KEY: process.env.CHARITY_API_KEY || 'change-this-key',
}