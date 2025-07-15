// models/Product.js
const BaseEntity = require('./BaseEntity');

class Product extends BaseEntity {
  constructor({
    id,
    articleName,
    articleNo,
    name,
    quantity,
    price,
    createdOn,
    barcodeNumber
  }) {
    super({ id, articleName, articleNo, name, quantity, price, createdOn });

    if (!name) {
      throw new Error('Product name is required');
    }

    if (!barcodeNumber) {
      throw new Error('barcodeNumber is required');
    }

    this.name = name;
    this.barcodeNumber = barcodeNumber;
  }
}

module.exports = Product;
