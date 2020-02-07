# Roots REST API

The REST API for [Roots](https://github.com/triciamedina/roots-app).

## Login

Returns a JWT allowing the user to access routes, services, and resources that are permitted with that token.

### Request

`POST /api/auth/login`

### Parameters

```
{
    "email": "test@test.com",
    "password": "mypassword01"
}
```

### Response

```
Status: 200 OK

{
    "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1ODEwMzY4NzMsInN1YiI6InRlc3RAdGVzdC5jb20ifQ.IHOl95oC2-MtDaEZH58_uN4a6Lu2oCWx-oTsEN1Uyok"
}
```

## Create a user

### Request

`POST /api/user`

### Parameters

```
{
    "email": "test@test.com",
    "first_name": "FirstName",
    "last_name": "LastName",
    "password": "mypassword01"
}
```

### Response

```
Status: 201 Created

{
    "id": 1,
    "email": "test@test.com",
    "first_name": "Test",
    "last_name": "LastName",
    "created_at": "2020-02-07T08:46:15.501Z",
    "auto_roundups": null
}
```

## Fetch a user

Requires user authentication. Lists public and private profile information when authenticated through JWT auth.

### Request

`GET /api/user`

### Response

```
Status: 200 OK

{
    "id": 1,
    "email": "test@test.com",
    "first_name": "Test",
    "last_name": "LastName",
    "created_at": "2020-02-07T08:46:15.501Z",
    "auto_roundups": null
}
```

## Update a user

Requires user authentication. Currently supports updating a user’s automatic roundups preference.

### Request

`PATCH /api/user`

### Parameters

```
{
    "autoRoundups": true
}
```

### Response

```
Status: 200 OK

{
    "id": 1,
    "email": "test@test.com",
    "first_name": "Test",
    "last_name": "LastName",
    "created_at": "2020-02-07T08:46:15.501Z",
    "auto_roundups": "2020-02-07T05:16:17.588Z"
}
```

## Fetch all donations for a user

Requires user authentication.

### Request

`GET /api/user/donation`

### Response

```
Status: 200 OK

[
    {
        "id": 1,
        "year": 2020,
        "donated_on": "2020-02-07T13:23:12.378Z",
        "amount": 10,
        "project_name": "My classroom project",
        "project_description": "Help make our classroom great",
        "project_url": "https://www.GreatProject.com",
        "school_name": "Park Elementary",
        "image_url": "https://www.GreatProject.com/1234.jpg"
    },
    {
        "id": 2,
        "year": 2020,
        "donated_on": "2020-02-05T13:23:12.378Z",
        "amount": 1.99,
        "project_name": "Another Project",
        "project_description": "Our classroom is the greatest",
        "project_url": "https://www.MyProject.com",
        "school_name": "Prairie Elementary",
        "image_url": "https://www.MyProject.com/1234.jpg"
    }
]
```

## Create a donation for a user

Requires user authentication.

### Request

`POST /api/user/donation`

### Parameters

```
{
    "amount": 10, 
    "project_name": "My classroom project", 
    "project_description": "Help make our classroom great", 
    "project_url": "https://www.GreatProject.com", 
    "school_name": "Park Elementary", 
    "image_url": "https://www.GreatProject.com/1234.jpg"
}
```

### Response

```
Status: 201 Created

{
    "id": 1,
    "donated_on": "2020-02-07T13:23:12.378Z",
    "amount": 10,
    "project_name": "My classroom project",
    "project_description": "Help make our classroom great",
    "project_url": "https://www.GreatProject.com",
    "school_name": "Park Elementary",
    "image_url": "https://www.GreatProject.com/1234.jpg"
}
```

## Fetch a Plaid access token for a user

Requires user authentication. Checks that a user has a Plaid access token. Returns a unique identifier to confirm that the access token exists but does not reveal the access token.

### Request

`GET /api/user/account`

### Response

```
Status: 200 OK

{
    "id": 1
}
```

## Create a Plaid access token for a user

Requires user authentication. Exchanges a user’s Plaid public token for a Plaid access token and an item ID used for retrieving transactions. Returns a unique identifier to confirm the access token has been created but does not reveal the access token.

### Request

`POST /api/user/account`

### Parameters

```
{
    "publicToken": "public-sandbox-25c9f853-4b8a-4601-83b8-777681387c3c"
    "accountId": "aZGl1BZAW3uvgp7y3zdbU1Ld3zKv3WF7aZbgG"
}
```

### Response

```
Status: 201 Created

{
    "id": 2
}
```

## Fetch all transactions for a user

Requires user authentication.

### Request

`GET /api/user/transaction`

### Response

```
Status: 200 OK

{
    "accounts": [
        {
            "account_id": "aZGl1BZAW3uvgp7y3zdbU1Ld3zKv3WF7aZbgG",
            "balances": {
                "available": 100,
                "current": 110,
                "iso_currency_code": "USD",
                "limit": null,
                "unofficial_currency_code": null
            },
            "mask": "0000",
            "name": "Plaid Checking",
            "official_name": "Plaid Gold Standard 0% Interest Checking",
            "subtype": "checking",
            "type": "depository"
        }
    ],
    "item": {
        "available_products": [
            "assets",
            "auth",
            "balance",
            "credit_details",
            "identity",
            "income",
            "investments",
            "liabilities"
        ],
        "billed_products": [
            "transactions"
        ],
        "consent_expiration_time": null,
        "error": null,
        "institution_id": "ins_3",
        "item_id": "PlAwKQl4aEC5mp7N9M3jFRzq4eymawi7MqqlE",
        "webhook": ""
    },
    "request_id": "11iLSrjrQAJrjJL",
    "total_transactions": 6,
    "transactions": [
        {
            "account_id": "aZGl1BZAW3uvgp7y3zdbU1Ld3zKv3WF7aZbgG",
            "account_owner": null,
            "amount": 6.33,
            "authorized_date": null,
            "category": [
                "Travel",
                "Taxi"
            ],
            "category_id": "22016000",
            "date": "2020-01-29",
            "iso_currency_code": "USD",
            "location": {
                "address": null,
                "city": null,
                "lat": null,
                "lon": null,
                "state": null,
                "store_number": null,
                "zip": null
            },
            "name": "Uber",
            "payment_channel": "in store",
            "payment_meta": {
                "by_order_of": null,
                "payee": null,
                "payer": null,
                "payment_method": null,
                "payment_processor": null,
                "ppd_id": null,
                "reason": null,
                "reference_number": null
            },
            "pending": false,
            "pending_transaction_id": null,
            "transaction_id": "ozo7lJzj3LFr79WV6BkxskD4ZRzNa5iRjboaW",
            "transaction_type": "special",
            "unofficial_currency_code": null
        },
        {
            "account_id": "aZGl1BZAW3uvgp7y3zdbU1Ld3zKv3WF7aZbgG",
            "account_owner": null,
            "amount": 5.4,
            "authorized_date": null,
            "category": [
                "Travel",
                "Taxi"
            ],
            "category_id": "22016000",
            "date": "2020-01-16",
            "iso_currency_code": "USD",
            "location": {
                "address": null,
                "city": null,
                "lat": null,
                "lon": null,
                "state": null,
                "store_number": null,
                "zip": null
            },
            "name": "Uber",
            "payment_channel": "in store",
            "payment_meta": {
                "by_order_of": null,
                "payee": null,
                "payer": null,
                "payment_method": null,
                "payment_processor": null,
                "ppd_id": null,
                "reason": null,
                "reference_number": null
            },
            "pending": false,
            "pending_transaction_id": null,
            "transaction_id": "gg63EPgByJue6yJpP4NWt4rlRa5mDPtgo5EbA",
            "transaction_type": "special",
            "unofficial_currency_code": null
        },
        {
            "account_id": "aZGl1BZAW3uvgp7y3zdbU1Ld3zKv3WF7aZbgG",
            "account_owner": null,
            "amount": -500,
            "authorized_date": null,
            "category": [
                "Travel",
                "Airlines and Aviation Services"
            ],
            "category_id": "22001000",
            "date": "2020-01-14",
            "iso_currency_code": "USD",
            "location": {
                "address": null,
                "city": null,
                "lat": null,
                "lon": null,
                "state": null,
                "store_number": null,
                "zip": null
            },
            "name": "United Airlines",
            "payment_channel": "other",
            "payment_meta": {
                "by_order_of": null,
                "payee": null,
                "payer": null,
                "payment_method": null,
                "payment_processor": null,
                "ppd_id": null,
                "reason": null,
                "reference_number": null
            },
            "pending": false,
            "pending_transaction_id": null,
            "transaction_id": "8rPQNDr71Rtd5Lzm8GrgHq1Rw7zvQAhwn8WAd",
            "transaction_type": "special",
            "unofficial_currency_code": null
        },
        {
            "account_id": "aZGl1BZAW3uvgp7y3zdbU1Ld3zKv3WF7aZbgG",
            "account_owner": null,
            "amount": 12,
            "authorized_date": null,
            "category": [
                "Food and Drink",
                "Restaurants",
                "Fast Food"
            ],
            "category_id": "13005032",
            "date": "2020-01-13",
            "iso_currency_code": "USD",
            "location": {
                "address": null,
                "city": null,
                "lat": null,
                "lon": null,
                "state": null,
                "store_number": "3322",
                "zip": null
            },
            "name": "McDonald's",
            "payment_channel": "in store",
            "payment_meta": {
                "by_order_of": null,
                "payee": null,
                "payer": null,
                "payment_method": null,
                "payment_processor": null,
                "ppd_id": null,
                "reason": null,
                "reference_number": null
            },
            "pending": false,
            "pending_transaction_id": null,
            "transaction_id": "EQW68wQAyrI5M7rzmNGXFxGK53oq6rCXym4yo",
            "transaction_type": "place",
            "unofficial_currency_code": null
        },
        {
            "account_id": "aZGl1BZAW3uvgp7y3zdbU1Ld3zKv3WF7aZbgG",
            "account_owner": null,
            "amount": 4.33,
            "authorized_date": null,
            "category": [
                "Food and Drink",
                "Restaurants",
                "Coffee Shop"
            ],
            "category_id": "13005043",
            "date": "2020-01-13",
            "iso_currency_code": "USD",
            "location": {
                "address": null,
                "city": null,
                "lat": null,
                "lon": null,
                "state": null,
                "store_number": null,
                "zip": null
            },
            "name": "Starbucks",
            "payment_channel": "in store",
            "payment_meta": {
                "by_order_of": null,
                "payee": null,
                "payer": null,
                "payment_method": null,
                "payment_processor": null,
                "ppd_id": null,
                "reason": null,
                "reference_number": null
            },
            "pending": false,
            "pending_transaction_id": null,
            "transaction_id": "WxA9aLxZQ4C5m8wraA6PFMopNx8163ulRj6Rn",
            "transaction_type": "place",
            "unofficial_currency_code": null
        },
        {
            "account_id": "aZGl1BZAW3uvgp7y3zdbU1Ld3zKv3WF7aZbgG",
            "account_owner": null,
            "amount": 89.4,
            "authorized_date": null,
            "category": [
                "Food and Drink",
                "Restaurants"
            ],
            "category_id": "13005000",
            "date": "2020-01-12",
            "iso_currency_code": "USD",
            "location": {
                "address": null,
                "city": null,
                "lat": null,
                "lon": null,
                "state": null,
                "store_number": null,
                "zip": null
            },
            "name": "SparkFun",
            "payment_channel": "in store",
            "payment_meta": {
                "by_order_of": null,
                "payee": null,
                "payer": null,
                "payment_method": null,
                "payment_processor": null,
                "ppd_id": null,
                "reason": null,
                "reference_number": null
            },
            "pending": false,
            "pending_transaction_id": null,
            "transaction_id": "APWmLxPgG9fZM5jq37AGUNj1KoDyq7f18598z",
            "transaction_type": "place",
            "unofficial_currency_code": null
        }
    ],
    "status_code": 200
}
```

## Getting Started

### Installing

Clone the repository and download dependencies.

```
$ git clone https://github.com/triciamedina/roots-server.git
$ cd roots-server
$ npm install
```

### Testing

Run tests with Mocha, Chai, and SuperTest.

```
$ npm run test
```

## Built With
- [Plaid API](https://plaid.com/docs/)
- [Donors Choose API](https://data.donorschoose.org/docs/overview/)
- [Node](https://nodejs.org/en/docs/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Moment.js](https://momentjs.com/)
