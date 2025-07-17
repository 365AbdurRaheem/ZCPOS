export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'date';
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

export interface CRUDConfig {
  title: string;
  fields: FormField[];
  columns: string[];
  fetchTotal: () => Promise<{ total: number }>;
  fetchItems: (page?: number, pageSize?: number) => Promise<{ roles: any[]; total: number }>;
  createItem: (data: any) => Promise<any>;
  updateItem: (id: string, data: any) => Promise<any>;
  deleteItem: (id: number) => Promise<any>;
}
