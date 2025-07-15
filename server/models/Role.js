class Role {
  constructor({ id, roleName, description = '', createdOn }) {
    if (!roleName) {
      throw new Error('roleId and roleName are required');
    }

    this.id = id;
    this.roleName = roleName;
    this.description = description;
    this.createdOn = createdOn || new Date().toISOString();
  }
}

module.exports = Role;
