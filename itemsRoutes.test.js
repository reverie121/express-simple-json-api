process.env.NODE_ENV = 'test';
const request = require('supertest');

const app = require('./app');

let items = require('./fakeDB');
const Item = require('./item')

let chocolate = new Item('Chocolate',1.49);

beforeEach(() => {
    items.push(chocolate);
});

afterEach(() => {
    items.length = 0;
    chocolate = new Item('Chocolate',1.49);
});

describe('GET /items', () => {
    test('Get a list of items', async () => {
        const resp = await request(app).get('/items');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual([{"name": "Chocolate","price": 1.49}]);
    });
});

describe('POST /items', () => {
    test('Add a new item to database array', async () => {
        const resp = await request(app).post('/items').send({"name": "Lime Juice", "price": 2.99});
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({"added": {"name": "Lime Juice","price": 2.99}});
    });
});

describe('GET /items/:itemName', () => {
    test('Get a specific item', async () => {
        const resp = await request(app).get('/items/chocolate');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"name": "Chocolate","price": 1.49});
    });
    test('404 for item not in db', async () => {
        const resp = await request(app).get('/items/chocolateisthebest');
        expect(resp.statusCode).toBe(404);
    });
});

describe('PATCH /items/:itemName', () => {
    test('Update a specific item\'s name', async () => {
        const resp = await request(app).patch('/items/chocolate').send({"name": "Chocolate Bar"});
        expect(resp.body).toEqual({"updated": {"name": "Chocolate Bar","price": 1.49}});
        expect(resp.statusCode).toBe(200);
    });
    test('Update a specific item\'s price', async () => {
        const resp = await request(app).patch('/items/chocolate').send({"price": 1.59});
        expect(resp.body).toEqual({"updated": {"name": "Chocolate","price": 1.59}});
        expect(resp.statusCode).toBe(200);
    });
    test('Update a specific item\'s name and price', async () => {
        const resp = await request(app).patch('/items/chocolate').send({"name": "Chocolate (Sale)", "price": 1.19});
        expect(resp.body).toEqual({"updated": {"name": "Chocolate (Sale)","price": 1.19}});
        expect(resp.statusCode).toBe(200);
    });
    test('404 for item not in db', async () => {
        const resp = await request(app).patch('/items/chocolateisthebest').send({"name": "Chocolate (Sale)", "price": 1.19});
        expect(resp.statusCode).toBe(404);
    });
});

describe('DELETE /items/:itemName', () => {
    test('Delete a specific item', async () => {
        const resp = await request(app).delete('/items/chocolate');
        expect(resp.body).toEqual({"message": "Deleted"});
        expect(resp.statusCode).toBe(200);
        expect(items).toEqual([]);
    });
    test('404 for item not in db', async () => {
        const resp = await request(app).delete('/items/chocolateisthebest');
        expect(resp.statusCode).toBe(404);
    });
});