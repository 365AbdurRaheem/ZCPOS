import React, { useState } from 'react';
import GenericForm from './GenericForm';
import DataTable from './DataTable';
import { Plus, XCircle } from 'lucide-react';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'date';
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

interface CRUDConfig {
  title: string;
  fields: FormField[];
  columns: string[];
  initialData?: any[];
}

const CRUDPage: React.FC<{
  config: CRUDConfig;
}> = ({ config }) => {
  const [data, setData] = useState(config.initialData || []);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  const handleSave = (formData: any) => {
    if (editingItem) {
      setData(prev => prev.map(item => 
        item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
      ));
    } else {
      setData(prev => [...prev, { ...formData, id: Date.now().toString() }]);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleView = (item: any) => {
    setViewingItem(item);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{config.title}</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Add New
        </button>
      </div>

      <DataTable
        data={data}
        columns={config.columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {showForm && (
        <GenericForm
          fields={config.fields}
          data={editingItem}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          isEdit={!!editingItem}
        />
      )}

      {viewingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">View Record</h2>
              <button
                onClick={() => setViewingItem(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="space-y-3">
              {config.fields.map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">
                    {viewingItem[field.name] || '-'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRUDPage;