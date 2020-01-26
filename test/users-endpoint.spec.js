const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Users Endpoints', function() {
    let db;

    const { testUsers, testDonations, testRoundups, testAccessTokens } = helpers.makeRootsFixtures();
    const testUser = testUsers[0];
    const testAccessToken = testAccessTokens[0];
    const token = helpers.makeAuthHeader(testUser);

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    });

    after('disconnect from db', () => db.destroy());

    before('clean the table', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));

    describe(`POST /api/user`, () => {
        context(`User Validation`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db, 
                    testUsers,
                )
            );

            const requiredFields = ['email', 'first_name', 'last_name', 'password'];

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    email: 'test email',
                    first_name: 'test first name',
                    last_name: 'test last name',
                    password: 'test password',
                };

                it(`responds with 400 required error when '${field}' is missing`, () => {
                    delete registerAttemptBody[field];

                    return supertest(app)
                        .post('/api/user')
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing '${field}' in request body`
                        })
                });
            });

            it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
                const userShortPassword = {
                    email: 'test email',
                    first_name: 'test first name',
                    last_name: 'test last name',
                    password: '1234567',
                };

                return supertest(app)
                    .post('/api/user')
                    .send(userShortPassword)
                    .expect(400, { error: `Password must be longer than 8 characters` })
            });

            it(`responds 400 'Password must be less than 36 characters' when long password`, () => {
                const userLongPassword = {
                    email: 'test email',
                    first_name: 'test first name',
                    last_name: 'test last name',
                    password: '*'.repeat(37),
                };

                return supertest(app)
                    .post('/api/user')
                    .send(userLongPassword)
                    .expect(400, { error: `Password must be less than 36 characters` })
            });

            it(`responds 400 error when password starts with spaces`, () => {
                const userPasswordStartsSpaces = {
                    email: 'test email',
                    first_name: 'test first name',
                    last_name: 'test last name',
                    password: ' 12345678',
                };

                return supertest(app)
                    .post('/api/user')
                    .send(userPasswordStartsSpaces)
                    .expect(400, { error: `Password must not start or end with empty spaces`})
            });

            it(`responds 400 error when password ends with spaces`, () => {
                const userPasswordEndsSpaces = {
                    email: 'test email',
                    first_name: 'test first name',
                    last_name: 'test last name',
                    password: '12345678 ',
                };

                return supertest(app)
                    .post('/api/user')
                    .send(userPasswordEndsSpaces)
                    .expect(400, { error: `Password must not start or end with empty spaces` })
            });

            it(`responds 400 error 'Account with this email already exists' when email isn't unique`, () => {
                const duplicateUser = {
                    email: testUser.email,
                    first_name: 'test first name',
                    last_name: 'test last name',
                    password: '12345678',
                };

                return supertest(app)
                    .post('/api/user')
                    .send(duplicateUser)
                    .expect(400, { error: `Account with this email already exists` })
            });
        });

        context(`Happy path`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db, 
                    testUsers,
                )
            );
            
            it(`responds 201, serialized user, storing bcrypted password`, () => {
                const newUser = {
                    email: 'test email',
                    first_name: 'test first name',
                    last_name: 'test last name',
                    password: '12345678',
                };

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
                                expect(row.auto_roundups).to.be.null
                                const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                                const actualDate = new Date(row.created_at).toLocaleString()
                                expect(actualDate).to.eql(expectedDate)

                                return bcrypt.compareSync(newUser.password, row.password)
                            })
                            .then(compareMatch => {
                                expect(compareMatch).to.be.true
                            })
                    )
            });
        });
    });

    describe(`GET /api/user`, () => { 
        context(`Happy path`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db, 
                    testUsers,
                )
            );

            it(`responds 200, serialized user`, () => {
                return supertest(app)
                    .get('/api/user')
                    .set({'Authorization': token})
                    .expect(200)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.email).to.eql(testUser.email)
                        expect(res.body.first_name).to.eql(testUser.first_name)
                        expect(res.body.last_name).to.eql(testUser.last_name)
                        expect(res.body).to.not.have.property('password')
                        expect(res.body.auto_roundups).to.be.null
                        const expectedDate = new Date(testUser.created_at).toLocaleString()
                        const actualDate = new Date(res.body.created_at).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
                    })
            })
        })
    });

    describe(`PATCH /api/user`, () => { 
        context('Happy path', () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db, 
                    testUsers,
                )
            );

            it('responds 200, serialized user', () => {
                const patch = {
                    autoRoundups: true
                };

                return supertest(app)
                    .patch('/api/user')
                    .set({'Authorization': token})
                    .send(patch)
                    .expect(200)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.email).to.eql(testUser.email)
                        expect(res.body.first_name).to.eql(testUser.first_name)
                        expect(res.body.last_name).to.eql(testUser.last_name)
                        expect(res.body).to.not.have.property('password')
                        const expectedRoundupDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                        const actualRoundupDate = new Date(res.body.auto_roundups).toLocaleString('en', { timeZone: 'UTC' })
                        expect(actualRoundupDate).to.eql(expectedRoundupDate)
                        const expectedDate = new Date(testUser.created_at).toLocaleString()
                        const actualDate = new Date(res.body.created_at).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
                    })
            })
        })
    });

    describe(`POST /api/user/donation`, () => { 
        context('Happy path', () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db, 
                    testUsers,
                )
            );

            it('responds 201, serialized donation', () => {
                const newDonation = {
                    amount: 24.99,
                    project_name: 'test project name',
                    project_description: 'test description', 
                    project_url: 'https://test.com', 
                    school_name: 'test school name', 
                    image_url: 'https://testimage.com',
                }

                return supertest(app)
                    .post('/api/user/donation')
                    .set({'Authorization': token})
                    .send(newDonation)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.amount).to.eql(newDonation.amount)
                        expect(res.body.project_name).to.eql(newDonation.project_name)
                        expect(res.body.project_description).to.eql(newDonation.project_description)
                        expect(res.body.project_url).to.eql(newDonation.project_url)
                        expect(res.body.school_name).to.eql(newDonation.school_name)
                        expect(res.body.image_url).to.eql(newDonation.image_url)
                        const expectedDonationDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                        const actualDonationDate = new Date(res.body.donated_on).toLocaleString()
                        expect(actualDonationDate).to.eql(expectedDonationDate)
                    })
                    .expect(res => 
                        db
                            .from('roots_donations')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.amount).to.eql(`${newDonation.amount}`)
                                expect(row.project_name).to.eql(newDonation.project_name)
                                expect(row.project_description).to.eql(newDonation.project_description)
                                expect(row.project_url).to.eql(newDonation.project_url)
                                expect(row.school_name).to.eql(newDonation.school_name)
                                expect(row.image_url).to.eql(newDonation.image_url)
                                const expectedDonationDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                                const actualDonationDate = new Date(row.donated_on).toLocaleString()
                                expect(actualDonationDate).to.eql(expectedDonationDate)
                            })
                    )
            })
        })
    });

    describe(`GET /api/user/donation`, () => { 
        context('Happy path', () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db, 
                    testUsers,
                )
            );

            beforeEach('insert donations', () =>
                helpers.seedDonations(
                    db, 
                    testDonations,
                )
            );

            it('responds 200, array of serialized donations', () => {
                return supertest(app)
                    .get('/api/user/donation')
                    .set({'Authorization': token})
                    .expect(200)
                    .expect(res => {
                        for (const field of [0, 1]) {
                            expect(res.body[field]).to.have.property('id')
                            expect(res.body[field]).to.have.property('year')
                            expect(res.body[field].amount).to.eql(testDonations[field].amount)
                            const expectedDate = new Date(testDonations[field].created_at).toLocaleString()
                            const actualDate = new Date(res.body[field].created_at).toLocaleString()
                            expect(actualDate).to.eql(expectedDate)
                            expect(res.body[field].image_url).to.eql(testDonations[field].image_url)
                            expect(res.body[field].project_description).to.eql(testDonations[field].project_description)
                            expect(res.body[field].project_name).to.eql(testDonations[field].project_name)
                            expect(res.body[field].project_url).to.eql(testDonations[field].project_url)
                            expect(res.body[field].school_name).to.eql(testDonations[field].school_name)
                        }
                    })
                    .expect(res => 
                        db
                            .from('roots_donations')
                            .select('*')
                            .where({ user_id: testUser.id })
                            .then(rows => {
                                for (const field of [0, 1]) {
                                    expect(rows[field]).to.have.property('id')
                                    expect(rows[field].amount).to.eql(`${testDonations[field].amount}`)
                                    const expectedDate = new Date(testDonations[field].created_at).toLocaleString()
                                    const actualDate = new Date(rows[field].created_at).toLocaleString()
                                    expect(actualDate).to.eql(expectedDate)
                                    expect(rows[field].image_url).to.eql(testDonations[field].image_url)
                                    expect(rows[field].project_description).to.eql(testDonations[field].project_description)
                                    expect(rows[field].project_name).to.eql(testDonations[field].project_name)
                                    expect(rows[field].project_url).to.eql(testDonations[field].project_url)
                                    expect(rows[field].school_name).to.eql(testDonations[field].school_name)
                                }
                            })
                    )
            })
        })
    });

    describe(`POST /api/user/roundup`, () => { 
        context('Happy path', () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db, 
                    testUsers,
                )
            );

            it('responds 201, serialized roundup', () => {
                const newRoundup = {
                    account_id: 'test acount id',
                    amount: 24.99,
                    date: '2020-01-16',
                    name: 'test name', 
                    transaction_id: 'test transaction id', 
                };

                return supertest(app)
                    .post('/api/user/roundup')
                    .set({'Authorization': token})
                    .send(newRoundup)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.user_id).to.eql(testUser.id)
                        expect(res.body.amount).to.eql(newRoundup.amount)
                        const actualTransactionDate = new Date(res.body.date).toLocaleString('en', { timeZone: 'UTC' })
                        const expectedTransactionDate = new Date(newRoundup.date).toLocaleString('en', { timeZone: 'UTC' })
                        expect(actualTransactionDate).to.eql(expectedTransactionDate)
                        expect(res.body.name).to.eql(newRoundup.name)
                        expect(res.body.transaction_id).to.eql(newRoundup.transaction_id)
                        const expectedDate = new Date().toLocaleString()
                        const actualDate = new Date(res.body.created_at).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
                    })
                    .expect(res => 
                        db
                            .from('roots_roundups')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.user_id).to.eql(testUser.id)
                                expect(row.account_id).to.eql(newRoundup.account_id)
                                expect(row.amount).to.eql(`${newRoundup.amount}`)
                                expect(row.date).to.eql(newRoundup.date)
                                expect(row.name).to.eql(newRoundup.name)
                                expect(row.transaction_id).to.eql(newRoundup.transaction_id)
                                const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                                const actualDate = new Date(row.created_at).toLocaleString('en', { timeZone: 'UTC' })
                                expect(actualDate).to.eql(expectedDate)
                            })
                    )
            })
        })
    });

    describe(`GET /api/user/roundup`, () => { 
        context('Happy path', () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db, 
                    testUsers,
                )
            );

            beforeEach('insert roundups', () =>
                helpers.seedRoundups(
                    db, 
                    testRoundups,
                )
            );
            
            it(`responds 200, array of serialized roundups`, () => {
                return supertest(app)
                    .get('/api/user/roundup')
                    .set({'Authorization': token})
                    .expect(200)
                    .expect(res => {
                        for (const field of [0, 1]) {
                            expect(res.body[field]).to.have.property('id')
                            expect(res.body[field].amount).to.eql(testRoundups[field].amount)
                            const expectedTransactionDate = new Date(testRoundups[field].date).toLocaleString('en', { timeZone: 'UTC' })
                            const actualTransactionDate = new Date(res.body[field].date).toLocaleString('en', { timeZone: 'UTC' })
                            expect(actualTransactionDate).to.eql(expectedTransactionDate)
                            expect(res.body[field].name).to.eql(testRoundups[field].name)
                            expect(res.body[field].transaction_id).to.eql(testRoundups[field].transaction_id)
                            const expectedDate = new Date(testRoundups[field].created_at).toLocaleString()
                            const actualDate = new Date(res.body[field].created_at).toLocaleString()
                            expect(actualDate).to.eql(expectedDate)
                        }
                    })
                    .expect(res => 
                        db
                            .from('roots_roundups')
                            .select('*')
                            .where({ user_id: testUser.id })
                            .then(rows => {
                                for (const field of [0, 1]) {
                                    expect(rows[field]).to.have.property('id')
                                    expect(rows[field].user_id).to.eql(testUser.id)
                                    expect(rows[field].account_id).to.eql(testRoundups[field].account_id)
                                    expect(rows[field].amount).to.eql(`${testRoundups[field].amount}`)
                                    const expectedTransactionDate = new Date(testRoundups[field].date).toLocaleString('en', { timeZone: 'UTC' })
                                    const actualTransactionDate = new Date(rows[field].date).toLocaleString('en', { timeZone: 'UTC' })
                                    expect(actualTransactionDate).to.eql(expectedTransactionDate)
                                    expect(rows[field].name).to.eql(testRoundups[field].name)
                                    expect(rows[field].transaction_id).to.eql(testRoundups[field].transaction_id)
                                    const expectedDate = new Date(testRoundups[field].created_at).toLocaleString()
                                    const actualDate = new Date(rows[field].created_at).toLocaleString()
                                    expect(actualDate).to.eql(expectedDate)
                                }
                            })
                    )
            })
        })
    });

    describe(`GET /api/user/account`, () => { 
        context('Happy path', () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db, 
                    testUsers,
                )
            );

            beforeEach('insert access tokens', () =>
                helpers.seedAcessTokens(
                    db, 
                    testAccessTokens,
                )
            );

            it('responds 200, serialized token', () => {
                return supertest(app)
                    .get('/api/user/account')
                    .set({'Authorization': token})
                    .expect(200)
                    .expect(res => {
                        expect(res.body.id).to.eql(testAccessToken.id)
                        expect(res.body).to.not.have.property('user_id')
                        expect(res.body).to.not.have.property('access_token')
                        expect(res.body).to.not.have.property('item_id')
                        expect(res.body).to.not.have.property('account_id')
                        expect(res.body).to.not.have.property('created_at')
                    })
            })
        });
    });
});