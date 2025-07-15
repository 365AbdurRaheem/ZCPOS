// models/Person.js
const BaseEntity = require('./BaseEntity');

class Person extends BaseEntity {
  constructor({ id, articleName, articleNo, name, quantity, price, createdOn, roleId, cnic, phone, address }) {
    super({ id, articleName, articleNo, name, quantity, price, createdOn });

    this.role = roleId;
    this.cnic = cnic || '';
    this.phone = phone || '';
    this.address = address || '';
  }
}

module.exports = Person;
