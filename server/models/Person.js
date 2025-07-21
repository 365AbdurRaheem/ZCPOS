// models/Person.js
class Person {
  constructor({ id, name, roleName, cnic, phone, email, address, createdOn }) {
    if (!roleName) {
      throw new Error('RoleName is required');
    }
    if (!name) {
      throw new Error('Name is required');
    }
    if (!phone) {
      throw new Error('Phone number is required');
    }

    this.id = id;
    this.name = name;
    this.role = roleName;
    this.cnic = cnic || '';
    this.phone = phone || '';
    this.email = email || '';
    this.address = address || '';
    this.createdOn = createdOn || new Date().toISOString();
  }
}

module.exports = Person;