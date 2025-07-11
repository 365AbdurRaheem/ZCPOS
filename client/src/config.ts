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
  initialData?: any[];
}

export const crudConfigs: { [key: string]: CRUDConfig } = {
  'raw-material': {
    title: 'Raw Material Management',
    fields: [
      { name: 'name', label: 'Material Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: ['Fabric', 'Thread', 'Accessories', 'Other'] },
      { name: 'supplier', label: 'Supplier', type: 'text', required: true },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true },
      { name: 'unit', label: 'Unit', type: 'select', required: true, options: ['Meters', 'Pieces', 'Kg', 'Rolls'] },
      { name: 'price', label: 'Price per Unit', type: 'number', required: true },
      { name: 'description', label: 'Description', type: 'textarea' }
    ],
    columns: ['name', 'category', 'supplier', 'quantity', 'unit', 'price'],
    initialData: [
      { id: '1', name: 'Cotton Fabric', category: 'Fabric', supplier: 'ABC Textiles', quantity: 100, unit: 'Meters', price: 25 },
      { id: '2', name: 'Silk Thread', category: 'Thread', supplier: 'XYZ Threads', quantity: 50, unit: 'Rolls', price: 15 }
    ]
  },
  'supplier': {
    title: 'Supplier Management',
    fields: [
      { name: 'name', label: 'Supplier Name', type: 'text', required: true },
      { name: 'contact', label: 'Contact Person', type: 'text', required: true },
      { name: 'phone', label: 'Phone Number', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'address', label: 'Address', type: 'textarea', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: ['Fabric', 'Thread', 'Accessories', 'Equipment'] },
      { name: 'paymentTerms', label: 'Payment Terms', type: 'select', options: ['Cash', 'Credit 30 Days', 'Credit 60 Days'] }
    ],
    columns: ['name', 'contact', 'phone', 'email', 'category', 'paymentTerms'],
    initialData: [
      { id: '1', name: 'ABC Textiles', contact: 'John Smith', phone: '123-456-7890', email: 'john@abc.com', category: 'Fabric', paymentTerms: 'Credit 30 Days' }
    ]
  },
  'embroidery-designer': {
    title: 'Embroidery Designer Management',
    fields: [
      { name: 'name', label: 'Designer Name', type: 'text', required: true },
      { name: 'phone', label: 'Phone Number', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'specialty', label: 'Specialty', type: 'select', required: true, options: ['Traditional', 'Modern', 'Bridal', 'Corporate'] },
      { name: 'experience', label: 'Experience (Years)', type: 'number', required: true },
      { name: 'rate', label: 'Rate per Design', type: 'number', required: true },
      { name: 'address', label: 'Address', type: 'textarea' }
    ],
    columns: ['name', 'phone', 'specialty', 'experience', 'rate'],
    initialData: []
  },
  'filler': {
    title: 'Filler Management',
    fields: [
      { name: 'name', label: 'Filler Name', type: 'text', required: true },
      { name: 'phone', label: 'Phone Number', type: 'text', required: true },
      { name: 'address', label: 'Address', type: 'textarea', required: true },
      { name: 'skill', label: 'Skill Level', type: 'select', required: true, options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
      { name: 'hourlyRate', label: 'Hourly Rate', type: 'number', required: true },
      { name: 'availability', label: 'Availability', type: 'select', options: ['Full Time', 'Part Time', 'Contract'] }
    ],
    columns: ['name', 'phone', 'skill', 'hourlyRate', 'availability'],
    initialData: []
  },
  'master': {
    title: 'Master Management',
    fields: [
      { name: 'name', label: 'Master Name', type: 'text', required: true },
      { name: 'phone', label: 'Phone Number', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'department', label: 'Department', type: 'select', required: true, options: ['Cutting', 'Stitching', 'Embroidery', 'Pressing', 'Packing'] },
      { name: 'experience', label: 'Experience (Years)', type: 'number', required: true },
      { name: 'salary', label: 'Monthly Salary', type: 'number', required: true },
      { name: 'joinDate', label: 'Join Date', type: 'date', required: true }
    ],
    columns: ['name', 'phone', 'department', 'experience', 'salary'],
    initialData: []
  },
  'stitcher': {
    title: 'Stitcher Management',
    fields: [
      { name: 'name', label: 'Stitcher Name', type: 'text', required: true },
      { name: 'phone', label: 'Phone Number', type: 'text', required: true },
      { name: 'skill', label: 'Skill Type', type: 'select', required: true, options: ['Hand Stitching', 'Machine Stitching', 'Overlock', 'Buttonhole'] },
      { name: 'experience', label: 'Experience (Years)', type: 'number', required: true },
      { name: 'pieceRate', label: 'Rate per Piece', type: 'number', required: true },
      { name: 'address', label: 'Address', type: 'textarea' }
    ],
    columns: ['name', 'phone', 'skill', 'experience', 'pieceRate'],
    initialData: []
  },
  'presser': {
    title: 'Presser Management',
    fields: [
      { name: 'name', label: 'Presser Name', type: 'text', required: true },
      { name: 'phone', label: 'Phone Number', type: 'text', required: true },
      { name: 'type', label: 'Press Type', type: 'select', required: true, options: ['Steam Press', 'Dry Press', 'Both'] },
      { name: 'experience', label: 'Experience (Years)', type: 'number', required: true },
      { name: 'hourlyRate', label: 'Hourly Rate', type: 'number', required: true },
      { name: 'shiftTime', label: 'Shift Time', type: 'select', options: ['Morning', 'Evening', 'Night'] }
    ],
    columns: ['name', 'phone', 'type', 'experience', 'hourlyRate'],
    initialData: []
  },
  'packer': {
    title: 'Packer Management',
    fields: [
      { name: 'name', label: 'Packer Name', type: 'text', required: true },
      { name: 'phone', label: 'Phone Number', type: 'text', required: true },
      { name: 'packingType', label: 'Packing Type', type: 'select', required: true, options: ['Garment', 'Bulk', 'Gift Wrapping'] },
      { name: 'experience', label: 'Experience (Years)', type: 'number', required: true },
      { name: 'dailyRate', label: 'Daily Rate', type: 'number', required: true },
      { name: 'address', label: 'Address', type: 'textarea' }
    ],
    columns: ['name', 'phone', 'packingType', 'experience', 'dailyRate'],
    initialData: []
  }
};