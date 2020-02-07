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
