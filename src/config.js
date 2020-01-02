module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DB_URL || 'postgresql:roots@localhost/roots',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    CHARITY_URLS: ['https://api.donorschoose.org/common/json_feed.html'],
    CHARITY_API_KEY: process.env.CHARITY_API_KEY || 'change-this-key',
}