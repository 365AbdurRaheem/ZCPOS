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

  useEffect(() => {
    fetchTotalCount(); // one-time fetch
  }, []);

  useEffect(() => {
    loadData();
  }, [page]);

  const fetchTotalCount = async () => {
    try {
      const res = await config.fetchTotal();
      const count = await res.total;
      setTotal(typeof count === 'number' ? count : count); // support both formats
    } catch (err) {
      console.error('Failed to fetch total count', err);
    }
  };

  const loadData = async () => {
    try {
      const result = await config.fetchItems(page, pageSize);
      setData(result.roles || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  const handleSave = async (formData: any) => {
    try {
      if (editingItem) {
        await config.updateItem(editingItem.id, formData);
      } else {
        await config.createItem(formData);
        await fetchTotalCount(); // refresh count after adding new item
      }
      setShowForm(false);
      setEditingItem(null);
      await loadData();
    } catch (err) {
      console.error('Error saving item:', err);
    }
  };

  const handleDelete = async (item: any) => {
    if (!window.confirm(`Delete record ${item.__serial}?`)) return;
    try {
      await config.deleteItem(item.__serial - 1); // send serial to API
      await fetchTotalCount(); // update count
      await loadData();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{config.title}</h1>
        <button
          onClick={() => { setShowForm(true); setEditingItem(null); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Info Row */}
      <div className="flex justify-end items-center text-sm text-gray-600 mb-2">
        Total Records: <strong className="mx-1">{total}</strong> | Page {page} of {totalPages}
      </div>

      {/* Data Table */}
      <DataTable
        data={data.map((item, idx) => ({
          ...item,
          __serial: (page - 1) * pageSize + idx + 1
        }))}
        columns={['__serial', ...config.columns]}
        onEdit={(item) => { setEditingItem(item); setShowForm(true); }}
        onDelete={(item) => handleDelete(item)} // pass full item here
        onView={(item) => setViewingItem(item)}
      />


      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">{page} / {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <GenericForm
          fields={config.fields}
          data={editingItem}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingItem(null); }}
          isEdit={!!editingItem}
        />
      )}

      {/* View Modal */}
      {viewingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">View Record</h2>
              <button onClick={() => setViewingItem(null)} className="text-gray-500 hover:text-gray-700">
                <XCircle size={24} />
              </button>
            </div>
            <div className="space-y-3">
              {config.fields.map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium">{field.label}</label>
                  <p className="bg-gray-50 px-3 py-2 rounded">
                    {field.name.toLowerCase().includes('date')
                      ? new Date(viewingItem[field.name]).toLocaleString()
                      : viewingItem[field.name] || '-'}
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
