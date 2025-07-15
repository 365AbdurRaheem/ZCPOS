// models/GatePass.js
const BaseEntity = require('./BaseEntity');

class GatePass extends BaseEntity {
  constructor({
    articleName,
    articleNo,
    name,
    quantity,
    total,
    paid,
    remaining,
    createdOn,
    personName,
    source,
    destination,
    type
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

    if (!source) throw new Error('Source is required');
    if (!destination) throw new Error('Destination is required');
    if (!type) throw new Error('Gate pass type is required');

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
      throw new Error(
        `Invalid gate pass type "${type}". Must be one of: ${allowedTypes.join(', ')}`
      );
    }

    this.person = personName || '';
    this.source = source;
    this.destination = destination;
    this.gatePassType = normalizedType;
  }
}

module.exports = GatePass;