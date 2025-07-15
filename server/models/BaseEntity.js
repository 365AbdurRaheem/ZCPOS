// models/BaseEntity.js
class BaseEntity {
  constructor({
    articleName,
    articleNo,
    name,
    quantity,
    total,
    paid,
    remaining,
    createdOn
  }) {
    this.id = `ID-${Date.now()}`;
    this.articleName = articleName || '';
    this.articleNo = articleNo || '';
    this.name = name || '';
    this.quantity = Number(quantity) || 0;

    this.total = typeof total === 'number' ? total : 0;
    this.paid = typeof paid === 'number' ? paid : 0;
    this.remaining =
      typeof remaining === 'number' ? remaining : this.total - this.paid;

    this.createdOn = createdOn || new Date().toISOString();
  }
}

module.exports = BaseEntity;