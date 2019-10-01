const request = require('supertest');
const app = require('./app')

describe('App', () => {

    test('It should response the GET method', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });

    test('It should response a JSON Array', async () => {
        const response = await request(app).get('/getData');
        expect(response.statusCode).toBe(200);
        response.body.forEach((dataPoint) => {
            // Ensure each data point is an object with an exact set of keys.
            expect(typeof dataPoint).toEqual('object');

            // Validate object properties 
            expect(Object.keys(dataPoint).sort()).toEqual(['p', 'plotColorGroup', 'weight', 'x', 'y']);

            // Validate simple property types.
            expect(typeof dataPoint.x).toEqual('number');
            expect(typeof dataPoint.y).toEqual('number');
            expect(typeof dataPoint.p).toEqual('number');
            expect(typeof dataPoint.weight).toEqual('number');
            expect(typeof dataPoint.plotColorGroup).toEqual('object');
        });
    })
})