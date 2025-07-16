import React, { useState, useEffect } from 'react';
import GenericForm from './GenericForm';
import DataTable from './DataTable';
import { Plus, XCircle } from 'lucide-react';
import type { CRUDConfig } from '../types/crud';

const CRUDPage: React.FC<{ config: CRUDConfig }> = ({ config }) => {
  const [data, setData] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [viewingItem, setViewingItem] = useState<any | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = async () => {
    try {
      const result = await config.fetchItems(page, pageSize); // must return { total, roles }
      const filtered = result.roles.filter((item: any) =>
        config.fields.some(field =>
          String(item[field.name] || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
      setData(filtered);
      setTotal(result.total);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleSave = async (formData: any) => {
    try {
      if (editingItem) {
        await config.updateItem(editingItem.id, formData);
      } else {
        await config.createItem(formData);
      }
      setShowForm(false);
      setEditingItem(null);
      await loadData();
    } catch (err) {
      console.error('Error saving item:', err);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await config.deleteItem(id);
        await loadData();
      } catch (err) {
        console.error('Error deleting item:', err);
      }
    }
  };

  const handleView = (item: any) => {
    setViewingItem(item);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">{config.title}</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
          }}
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

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {page} of {Math.ceil(total / pageSize)}
        </span>
        <button
          onClick={() => setPage(prev => prev + 1)}
          disabled={page * pageSize >= total}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

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
