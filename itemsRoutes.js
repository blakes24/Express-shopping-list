const express = require('express');
const router = new express.Router();
const ExpressError = require('./expressError');
const fakeDb = require('./fakeDb');

router.get('/', (req, res) => {
	res.json(items);
});

router.post('/', (req, res) => {
	let item = req.body;
	items.push(item);
	res.status(201).json({ added: item });
});

router.get('/:name', (req, res) => {
	const foundItem = items.find((item) => item.name === req.params.name);
	if (!foundItem) {
		throw new ExpressError('Item not found', 404);
	}
	res.json(foundItem);
});

router.patch('/:name', (req, res) => {
	const foundItem = items.find((item) => item.name === req.params.name);
	if (!foundItem) {
		throw new ExpressError('Item not found', 404);
	}
	foundItem.name = req.body.name || foundItem.name;
	foundItem.price = req.body.price || foundItem.price;
	res.json({ updated: foundItem });
});

router.delete('/:name', (req, res) => {
	const foundItem = items.findIndex((item) => item.name === req.params.name);
	if (foundItem === -1) {
		throw new ExpressError('Item not found', 404);
	}
	items.splice(foundItem, 1);
	res.json({ message: 'Deleted' });
});

module.exports = router;
