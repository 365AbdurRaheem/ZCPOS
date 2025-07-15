// models/GatePass.js
const BaseEntity = require('./BaseEntity');

class GatePass extends BaseEntity {
  constructor({
    id,
    articleName,
    articleNo,
    name,
    quantity,
    price,
    createdOn,
    personId,
    source,
    destination,
    type
  }) {
    super({ id, articleName, articleNo, name, quantity, price, createdOn });

    if (!personId) throw new Error('personId is required');
    if (!source) throw new Error('source is required');
    if (!destination) throw new Error('destination is required');
    if (!type) throw new Error('type is required');

    const allowedTypes = [
      'embroidery',
      'filling',
      'cutting',
      'stitching',
      'pressing',
      'packing',
      'transport',
      'store'
    ];

    const normalizedType = type.toLowerCase();
    if (!allowedTypes.includes(normalizedType)) {
      throw new Error(`Invalid gate pass type "${type}". Must be one of: ${allowedTypes.join(', ')}`);
    }

    this.personId = personId;
    this.source = source;
    this.destination = destination;
    this.type = normalizedType;
  }
}

module.exports = GatePass;
