const config = require('../config')
const fetch = require('node-fetch')

const CharityService = {
    getCharities(queryString) {
        return config.CHARITY_URLS.map(charity => {
            const url = charity + '?' + queryString
            return fetch(url)
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    }
                    throw new Error(response.statusText)
                })
        })
    },
    formatQueryParams(params) {
        const queryItems = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        return queryItems.join('&');
    }
}

module.exports = CharityService