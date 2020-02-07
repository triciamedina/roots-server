# Roots REST API

The REST API for [Roots](https://github.com/triciamedina/roots-app).

## Login

`POST /api/auth/login`

### Parameters

| Name | Type | Description |
| ----------- | ----------- | ----------- | 
| `email` | `string` | Required |
| `password` | `string` | Required |

### Response

    Status: 200 OK

    {
        "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1ODEwMzY4NzMsInN1YiI6InRlc3RAdGVzdC5jb20ifQ.IHOl95oC2-MtDaEZH58_uN4a6Lu2oCWx-oTsEN1Uyok"
    }

## Add a new user

`POST /api/user`

### Parameters

| Name | Type | Description |
| ----------- | ----------- | ----------- | 
| `email` | `string` | Required |
| `first_name` | `string` | Required |
| `last_name` | `string` | Required |
| `password` | `string` | Required |

### Response

    Status: 201 Created

    {
        "id": 1,
        "email": "test@test.com",
        "first_name": "Test",
        "last_name": "LastName",
        "created_at": "2020-02-07T08:46:15.501Z",
        "auto_roundups": null
    }

## Get a single authenticated user

Lists public and private profile information when authenticated through JWT auth

`GET /api/user`

### Response

    Status: 201 Created

    {
        "id": 1,
        "email": "test@test.com",
        "first_name": "Test",
        "last_name": "LastName",
        "created_at": "2020-02-07T08:46:15.501Z",
        "auto_roundups": null
    }

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
