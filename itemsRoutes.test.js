process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('./app');
const items = require('./fakeDb');

let chips = { name: 'chips', price: 1.25 };

beforeEach(function() {
	items.push(chips);
});

afterEach(function() {
	// empty items array
	items.length = 0;
});

describe('GET /items', function() {
	test('Gets a list of items', async function() {
		const resp = await request(app).get(`/items`);

		expect(resp.statusCode).toBe(200);
		expect(resp.body).toEqual([ chips ]);
	});
});

describe('POST /items', function() {
	test('Adds an item', async function() {
		const resp = await request(app).post(`/items`).send({
			name  : 'Cheerios',
			price : 3.5
		});

		expect(resp.statusCode).toBe(201);
		expect(items.length).toEqual(2);
		expect(resp.body).toEqual({
			added : {
				name  : 'Cheerios',
				price : 3.5
			}
		});
	});
});

describe('GET /items/:name', function() {
	test('Displays an item', async function() {
		const resp = await request(app).get(`/items/chips`);

		expect(resp.statusCode).toBe(200);
		expect(resp.body).toEqual(chips);
	});

	test('404 if item not found', async function() {
		const resp = await request(app).get(`/items/chocolate`);
		expect(resp.statusCode).toBe(404);
	});
});

describe('PATCH /items/:name', function() {
	test('Updates an item', async function() {
		const resp = await request(app).patch(`/items/chips`).send({
			name  : 'Cheerios',
			price : 3.5
		});

		expect(resp.statusCode).toBe(200);
		expect(items.length).toEqual(1);
		expect(resp.body).toEqual({
			updated : {
				name  : 'Cheerios',
				price : 3.5
			}
		});
	});

	test('404 if item not found', async function() {
		const resp = await request(app).patch(`/items/chocolate`).send({
			name  : 'Cheerios',
			price : 3.5
		});
		expect(resp.statusCode).toBe(404);
	});
});

describe('DELETE /items/:name', function() {
	test('Deletes an item', async function() {
		const resp = await request(app).delete(`/items/${chips.name}`);

		expect(resp.statusCode).toBe(200);
		expect(items.length).toEqual(0);
		expect(resp.body).toEqual({ message: 'Deleted' });
	});

	test('404 if item not found', async function() {
		const resp = await request(app).delete(`/items/chocolate`);
		expect(resp.statusCode).toBe(404);
	});
});
