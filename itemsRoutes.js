const express = require('express');
const router = new express.Router();

const Item = require('./item');
let items = require('./fakeDB');
const ExpressError = require('./expressError');

router.get('/', (request, response) => {
    return response.json(items);
});

router.post('/', (request, response, next) => {
    try {
        const newItem = new Item(request.body.name, request.body.price);
        items.push(newItem);
        return response.status(201).json({'added': newItem});
    } catch(error) {
        return next(error)
    }
});

router.get('/:itemName', (request, response) => {
    const foundItem = items.find(item => item.name.toLowerCase() == request.params.itemName.toLowerCase());
    if (foundItem === undefined) throw new ExpressError('Item not found', 404);
    return response.json(foundItem);
});

router.patch('/:itemName', (request, response) => {
    const foundItem = items.find(item => item.name.toLowerCase() == request.params.itemName.toLowerCase());
    if (foundItem === undefined) throw new ExpressError('Item not found', 404);
    if (request.body.name) foundItem.name = request.body.name;
    if (request.body.price) foundItem.price = request.body.price;
    return response.json({"updated": foundItem});
});

router.delete('/:itemName', (request, response) => {
    const foundItem = items.find(item => item.name.toLowerCase() == request.params.itemName.toLowerCase());
    if (foundItem === undefined) throw new ExpressError('Item not found', 404);
    items.splice(foundItem, 1);
    return response.json({"message": "Deleted"});
});

module.exports = router