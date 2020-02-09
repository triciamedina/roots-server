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

## Create a round up for a user

Requires user authentication.

### Request

`POST /api/user/roundup`

### Parameters

```
{
	"account_id": "aZGl1BZAW3uvgp7y3zdbU1Ld3zKv3WF7aZbgG", 
	"amount": 4.33, 
	"date": "2020-01-13", 
	"name": "Starbucks", 
	"transaction_id": "WxA9aLxZQ4C5m8wraA6PFMopNx8163ulRj6Rn"
}
```

### Response

```
Status: 201 Created

{
    "id": 1,
    "user_id": 1,
    "amount": 4.33,
    "date": "2020-01-13T00:00:00.000Z",
    "name": "Starbucks",
    "transaction_id": "WxA9aLxZQ4C5m8wraA6PFMopNx8163ulRj6Rn",
    "created_at": "2020-02-07T06:06:12.333Z"
}
```

## Fetch all round ups for a user

Requires user authentication.

### Request

`GET /api/user/roundup`


### Response

```
Status: 200 OK

[
    {
        "id": 1,
        "amount": 4.33,
        "date": "2020-01-13T00:00:00.000Z",
        "name": "Starbucks",
        "transaction_id": "WxA9aLxZQ4C5m8wraA6PFMopNx8163ulRj6Rn",
        "created_at": "2020-02-07T06:06:12.333Z"
    },
    {
        "id": 2,
        "amount": 89.4,
        "date": "2020-01-13T00:00:00.000Z",
        "name": "SparkFun",
        "transaction_id": "APWmLxPgG9fZM5jq37AGUNj1KoDyq7f18598z",
        "created_at": "2020-02-07T06:06:12.333Z"
    },
]
```

## Fetch charities

Requires user authentication.

### Request

`GET /api/charity`

### Path Parameters

`APIKey` <DonorsChoose.org API KEY>

`zip` 5-digit zip code

`index` By default, the start index of the result set is 0

`max` By default, the maximum number of projects returned is 10

`showSynposis` To show the synopsis for each project listing set this to true

### Response

```
Status: 200 OK

{
    "data": [
        {
            "searchTerms": "Most urgent",
            "searchURL": "https://www.donorschoose.org/donors/search.html?zip=94804&showSynopsis=true&utm_source=api&utm_medium=feed&utm_content=searchlink&utm_campaign=DONORSCHOOSE",
            "totalProposals": "50015",
            "index": "0",
            "max": "10",
            "breadcrumb": [
                [
                    "zip",
                    "94804",
                    ""
                ],
                [
                    "max",
                    "10",
                    ""
                ]
            ],
            "latitude": 37.92363357543945,
            "longitude": -122.3443374633789,
            "proposals": [
                {
                    "id": "4738093",
                    "proposalURL": "https://www.donorschoose.org/project/for-the-love-of-reading/4738093/?utm_source=api&utm_medium=feed&utm_content=bodylink&utm_campaign=DONORSCHOOSE",
                    "fundURL": "https://secure.donorschoose.org/donors/givingCart.html?proposalid=4738093&donationAmount=45&utm_source=api&utm_medium=feed&utm_content=fundlink&utm_campaign=DONORSCHOOSE",
                    "imageURL": "https://www.donorschoose.org/teacher/photo/u5544606?size=sm&t=1579210462553",
                    "retinaImageURL": "https://www.donorschoose.org/teacher/photo/u5544606?size=retina&t=1579210462553",
                    "thumbImageURL": "https://www.donorschoose.org/teacher/photo/u5544606?size=thmb&t=1579210462553",
                    "title": "For the Love of Reading",
                    "shortDescription": "I love teaching second graders because at this age, students start to develop their own voice, sense of self, and character. This is the age when I can support how students think about their...",
                    "fulfillmentTrailer": "Help me give my students floor cushions, dry erase markers, clipboards, and Post-It notes for our Reader's Workshop.",
                    "snippets": [],
                    "synopsis": "I love teaching second graders because at this age, students start to develop their own voice, sense of self, and character. This is the age when I can support how students think about their identity as a student and how they approach learning. \r\n\r\n99% of my students are Latino, and all come from low-income immigrant families. The majority of the students are bused to our school. Despite the hardships my students face as 7 and 8-year-olds, they enter the classroom every day curious, eager, nervous, and bright-eyed. They are ready to laugh, play, and challenge themselves in order to become lifelong leaders and learners.&lt;br/&gt;&lt;br/&gt;This year, my school started the Lucy Calkins Reader&#039;s Workshop curriculum. The focus of this workshop is to teach students to not only learn to read, but how to read to learn. My goal is for students to begin to love to read and get hooked into their books. The seat cushions will allow students to pick a comfortable spot to read. The manila folders, clipboards, post-it notes, and whiteboard markers will allow students to bring their work to the carpet. This will increase their levels of engagement during reading time. \r\n\r\nFor many of my students, they don&#039;t have a safe or quiet place to read at home. This makes reading time at school that much more important. This is such an important year in their cognitive development and they also need to build their sense of self and self-confidence. This is the moment to support their reading development. These materials will allow me to organize and create the best reading environment for my students.",
                    "percentFunded": "72",
                    "numDonors": "7",
                    "costToComplete": "153.98",
                    "studentLed": false,
                    "numStudents": "24",
                    "professionalDevelopment": false,
                    "matchingFund": {
                        "matchingKey": "",
                        "ownerRegion": "",
                        "name": "",
                        "donorSalutation": "",
                        "type": "",
                        "matchImpactMultiple": "",
                        "multipleForDisplay": "",
                        "logoURL": "",
                        "amount": "0.00",
                        "description": ""
                    },
                    "totalPrice": "551.04",
                    "freeShipping": "true",
                    "teacherId": "5544606",
                    "teacherName": "Ms. Kohut",
                    "gradeLevel": {
                        "id": "1",
                        "name": "Grades PreK-2"
                    },
                    "povertyLevel": "Nearly all students from low‑income households",
                    "povertyType": {
                        "label": "HIGHEST",
                        "name": "Nearly all students from low‑income households",
                        "range": "90%+",
                        "showPovertyLevel": "true"
                    },
                    "teacherTypes": [
                        {
                            "id": 1,
                            "name": "Teach For America"
                        }
                    ],
                    "schoolTypes": [],
                    "schoolName": "Grant Elementary School",
                    "schoolUrl": "https://www.donorschoose.org/school/grant-elementary-school/4210/",
                    "city": "Richmond",
                    "zip": "94804-1458",
                    "state": "CA",
                    "stateFullName": "California",
                    "latitude": "37.923633575439453",
                    "longitude": "-122.344337463378910",
                    "zone": {
                        "id": "402",
                        "name": "California (North)"
                    },
                    "subject": {
                        "id": "25",
                        "name": "ESL",
                        "groupId": "6"
                    },
                    "additionalSubjects": [
                        {
                            "id": "10",
                            "name": "Literacy",
                            "groupId": "6"
                        }
                    ],
                    "resource": {
                        "id": "10",
                        "name": "Classroom Basics"
                    },
                    "expirationDate": "2020-05-16",
                    "expirationTime": 1589601600000,
                    "fundingStatus": "needs funding"
                },
            }
	]
    }
```

## Getting Started

### Setting up

Install dependencies

```
npm install
```

Create development and test databases

```
createdb roots
createdb roots-test
```

Create database user

```
createduser roots
```

Grant priveleges to new user in `psql`

```
GRANT ALL PRIVELEGES ON DATABASE roots TO roots
GRANT ALL PRIVELEGES ON DATABASE "roots-test" TO roots
```

Bootstrap development database

```
npm run migrate 
```

Bootstrap test database

```
npm run migrate:test
```

### Sample Data

To seed the database for development

```
psql -U roots -d roots -a -f seeds/seed.roots_users.sql
```

### Testing

Run tests with Mocha, Chai, and SuperTest.

```
npm run test
```

## Built With
- [Plaid API](https://plaid.com/docs/)
- [Donors Choose API](https://data.donorschoose.org/docs/overview/)
- [Node](https://nodejs.org/en/docs/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Moment.js](https://momentjs.com/)
