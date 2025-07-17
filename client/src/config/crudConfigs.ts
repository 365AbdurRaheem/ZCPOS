import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  fetchTotalCount,
} from '../services/roleService';
import type { CRUDConfig } from '../types/crud'; // ✅ Import interface
 
export const crudConfigs: { [key: string]: CRUDConfig } = {
  roles: {
    title: 'Role Management',
    columns: ['roleName', 'description', 'createdOn'],
    fields: [
      { name: 'roleName', label: 'Role Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
    fetchTotal: fetchTotalCount,
    fetchItems: fetchRoles,
    createItem: createRole,
    updateItem: updateRole,
    deleteItem: deleteRole,
  },
};
