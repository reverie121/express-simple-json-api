class Item {
    constructor(name, price) {
        this.name = name;
        this.price = price || 0.99;
    }
}

module.exports = Item