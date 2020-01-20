const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Charity Endpoints', function() {
    let db;

    const { testUsers }  = helpers.makeRootsFixtures();
    const testUser = testUsers[0];
    const token = helpers.makeAuthHeader(testUser)

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    });

    after('disconnect from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));

    describe(`GET /api/charity`, () => {
        context('Happy path', () => {
            beforeEach('insert users', () => 
                helpers.seedUsers(
                    db,
                    testUsers
                )
            );
            
            it('responds 200, search data', () => {
                const testQuery = {
                    zip: 94804,
                    max: 10,
                    index: 0
                };

                return supertest(app)
                    .get('/api/charity')
                    .set({'Authorization': token})
                    .query(testQuery)
                    .expect(200)
                    .expect(res => {
                        expect(res.body).to.have.nested.property('data[0].proposals')
                        const results = res.body.data[0].proposals
                        expect(results).to.be.an('array')
                        expect(results).to.have.lengthOf('10')
                        for (let i = 0; i < results.length; i++) {
                            expect(results[i]).to.include.keys(
                                'id',
                                'proposalURL',
                                'imageURL',
                                'thumbImageURL',
                                'title',
                                'shortDescription',
                                'fulfillmentTrailer',
                                'costToComplete',
                                'totalPrice',
                                'teacherName',
                                'gradeLevel',
                                'schoolName',
                                'city',
                                'zip',
                                'state'
                            )
                        }
                    });
            });
        });
    });
});