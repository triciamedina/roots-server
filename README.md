# Roots REST API

The REST API for [Roots](https://github.com/triciamedina/roots-app).

## Login

### Request

`POST /api/login/`

### Parameters

| Name | Type | Description |
| ----------- | ----------- | ----------- | 
| `email` | `string` | Required |
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
