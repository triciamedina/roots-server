const config = require('../config')

const CharityService = {
    getCharities() {
        return config.CHARITY_URLS
    },
    formatQueryParams(params) {
        const queryItems = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        return queryItems.join('&');
    }
}

module.exports = CharityService