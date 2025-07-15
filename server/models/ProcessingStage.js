// models/ProcessingStage.js
const BaseEntity = require('./BaseEntity');

class ProcessingStage extends BaseEntity {
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
    condition,
    status
  }) {
    // Call parent constructor with the correct parameters that BaseEntity expects
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

    this.person = personName;
    this.stage = normalizedCondition;
    this.status = normalizedStatus;
  }
}

module.exports = ProcessingStage;