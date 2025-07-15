// models/ProcessingStage.js
const BaseEntity = require('./BaseEntity');

class ProcessingStage extends BaseEntity {
  constructor({
    id,
    articleName,
    articleNo,
    name,
    quantity,
    price,
    createdOn,
    personId,
    condition,
    status
  }) {
    super({ id, articleName, articleNo, name, quantity, price, createdOn });

    if (!personId) {
      throw new Error('personId (FK to Person) is required');
    }

    const allowedConditions = [
      'raw',
      'embroidery',
      'filling',
      'cutting',
      'stitching',
      'pressing',
      'packing'
    ];
    const allowedStatuses = ['pending', 'completed'];

    const normalizedCondition = condition?.toLowerCase();
    const normalizedStatus = status?.toLowerCase();

    if (!allowedConditions.includes(normalizedCondition)) {
      throw new Error(`Invalid condition "${condition}". Must be one of: ${allowedConditions.join(', ')}`);
    }

    if (!allowedStatuses.includes(normalizedStatus)) {
      throw new Error(`Invalid status "${status}". Must be one of: ${allowedStatuses.join(', ')}`);
    }

    this.personId = personId;
    this.stage = normalizedCondition;
    this.status = normalizedStatus;
  }
}

module.exports = ProcessingStage;
