const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const bcrypt = require('bcryptjs')

describe('Users Endpoints', function() {
    let db

    const { testUsers } = helpers.makeRootsFixtures()
    const testUser = testUsers[0]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/user`, () => {
        context(`User Validation`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db, 
                    testUsers,
                )
            )

            const requiredFields = ['email', 'first_name', 'last_name', 'password']

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    email: 'test email',
                    first_name: 'test first name',
                    last_name: 'test last name',
                    password: 'test password',
                }

                it(`responds with 400 required error when '${field}' is missing`, () => {
                    delete registerAttemptBody[field]

                    return supertest(app)
                        .post('/api/user')
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing '${field}' in request body`
                        })
                })
            })

            it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
                const userShortPassword = {
                    email: 'test email',
                    first_name: 'test first name',
                    last_name: 'test last name',
                    password: '1234567',
                }

                return supertest(app)
                    .post('/api/user')
                    .send(userShortPassword)
                    .expect(400, { error: `Password must be longer than 8 characters` })
            })

            it(`responds 400 'Password must be less than 36 characters' when long password`, () => {
                const userLongPassword = {
                    email: 'test email',
                    first_name: 'test first name',
                    last_name: 'test last name',
                    password: '*'.repeat(37),
                }

                return supertest(app)
                    .post('/api/user')
                    .send(userLongPassword)
                    .expect(400, { error: `Password must be less than 36 characters` })
            })

            it(`responds 400 error when password starts with spaces`, () => {
                const userPasswordStartsSpaces = {
                    email: 'test email',
                    first_name: 'test first name',
                    last_name: 'test last name',
                    password: ' 12345678',
                }

                return supertest(app)
                    .post('/api/user')
                    .send(userPasswordStartsSpaces)
                    .expect(400, { error: `Password must not start or end with empty spaces`})
            })

            it(`responds 400 error when password ends with spaces`, () => {
                const userPasswordEndsSpaces = {
                    email: 'test email',
                    first_name: 'test first name',
                    last_name: 'test last name',
                    password: '12345678 ',
                }

                return supertest(app)
                    .post('/api/user')
                    .send(userPasswordEndsSpaces)
                    .expect(400, { error: `Password must not start or end with empty spaces` })
            })

            it(`responds 400 error 'Account with this email already exists' when email isn't unique`, () => {
                const duplicateUser = {
                    email: testUser.email,
                    first_name: 'test first name',
                    last_name: 'test last name',
                    password: '12345678',
                }

                return supertest(app)
                    .post('/api/user')
                    .send(duplicateUser)
                    .expect(400, { error: `Account with this email already exists` })
            })
        })

        context(`Happy path`, () => {
            it(`responds 201, serialized user, storing bcrypted password`, () => {
                const newUser = {
                    email: 'test email',
                    first_name: 'test first name',
                    last_name: 'test last name',
                    password: '12345678',
                }

                return supertest(app)
                    .post('/api/user')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.email).to.eql(newUser.email)
                        expect(res.body.first_name).to.eql(newUser.first_name)
                        expect(res.body.last_name).to.eql(newUser.last_name)
                        expect(res.body).to.not.have.property('password')
                        expect(res.headers.location).to.eql(`/api/user/${res.body.id}`)
                        const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                        const actualDate = new Date(res.body.created_at).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
                    })
                    .expect(res => 
                        db
                            .from('roots_users')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.email).to.eql(newUser.email)
                                expect(row.first_name).to.eql(newUser.first_name)
                                expect(row.last_name).to.eql(newUser.last_name)
                                const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                                const actualDate = new Date(row.created_at).toLocaleString()
                                expect(actualDate).to.eql(expectedDate)

                                return bcrypt.compareSync(newUser.password, row.password)
                            })
                            .then(compareMatch => {
                                expect(compareMatch).to.be.true
                            })
                    )
            })
        })
    })
})