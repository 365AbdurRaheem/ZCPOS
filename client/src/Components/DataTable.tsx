import React, { useState } from 'react';
import { Search, Eye, Edit, Trash2 } from 'lucide-react';

const DataTable: React.FC<{
  data: any[];
  columns: string[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  onView: (item: any) => void;
}> = ({ data, columns, onEdit, onDelete, onView }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item =>
    columns.some(col =>
      item[col]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Helper: format timestamp into readable date+time
  const formatDateTime = (value: string) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase">#</th>
              {columns.map(col => (
                <th key={col} className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                  {col.replace(/([A-Z])/g, ' $1').trim()}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                {columns.map(col => (
                  <td key={col} className="px-4 py-3 text-sm text-gray-900">
                    {col.toLowerCase().includes('date') || col.toLowerCase().includes('createdon')
                      ? formatDateTime(item[col])
                      : item[col] || '-'}
                  </td>
                ))}
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => onView(item)}
                    className="text-blue-600 hover:text-blue-800"
                    title="View"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    className="text-green-600 hover:text-green-800"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No data found
        </div>
      )}
    </div>
  );
};

export default DataTable;
