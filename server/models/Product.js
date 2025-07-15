// models/Product.js
const BaseEntity = require('./BaseEntity');

class Product extends BaseEntity {
  constructor({
    articleName,
    articleNo,
    productName,
    quantity,
    total,
    paid,
    remaining,
    createdOn,
    barcodeNumber
  }) {
    super({
      articleName,
      articleNo,
      name,
      quantity,
      total,
      paid,
      remaining,
      createdOn
    });

    if (!productName) {
      throw new Error('Product name is required');
    }

    if (!barcodeNumber) {
      throw new Error('Barcode number is required');
    }

    this.productName = name;
    this.barcodeNumber = barcodeNumber;
  }
}

module.exports = Product;