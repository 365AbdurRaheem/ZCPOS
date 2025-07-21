import React, { useState, useEffect } from 'react';
import BASE_URL from '../config';
import { Edit, Trash2, Plus } from 'lucide-react';

const RolesList: React.FC = () => {
  const [roles, setRoles] = useState<{ id: string; roleName: string; description: string; createdOn: string }[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{ id: string; roleName: string; description: string; createdOn: string }>({ id: '', roleName: '', description: '', createdOn: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchRoles();
    fetchTotal();
  }, [page, search]);

  const fetchRoles = async () => {
    const url = search
      ? `${BASE_URL}/api/roles`
      : `${BASE_URL}/api/roles/paginated?pageNumber=${page}&pageSize=${pageSize}`;
    const response = await fetch(url);
    const data = await response.json();
    setRoles(data.roles);
  };

  const fetchTotal = async () => {
    const response = await fetch(`${BASE_URL}/api/roles/total`);
    const data = await response.json();
    setTotal(data.total || 0);
  };

  const handleDelete = async (serialNumber: number) => {
    if (confirm(`Do you want to delete role ${serialNumber}?`)) {
      try {
        await fetch(`${BASE_URL}/api/roles/${serialNumber - 1}`, { method: 'DELETE' });
        await fetchRoles();
        await fetchTotal();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleEdit = (role: { id: string; roleName: string; description: string; createdOn: string }) => {
    setFormData(role);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({ id: '', roleName: '', description: '', createdOn: new Date().toISOString() });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing ? `${BASE_URL}/api/roles/${formData.id}` : `${BASE_URL}/api/roles`;
      const method = isEditing ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      await fetchRoles();
      await fetchTotal();
      setShowForm(false);
      setFormData({ id: '', roleName: '', description: '', createdOn: '' });
    } catch (error) {
      console.error(`${isEditing ? 'Edit' : 'Add'} failed:`, error);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'startDate') {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
    setPage(1);
  };

  const filteredRoles = roles?.filter(role => {
    const matchesSearch = role.roleName.toLowerCase().includes(search.toLowerCase()) ||
      role.description.toLowerCase().includes(search.toLowerCase());
    const roleDate = new Date(role.createdOn);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const matchesDate = (!start || roleDate >= start) && (!end || roleDate <= end);
    return matchesSearch && matchesDate;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-gray-800 border-b-2 border-gray-300 pb-2">Roles Management</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 flex items-center"
        >
          <Plus size={20} className="mr-2" /> Add Role
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Role' : 'Add Role'}</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Role Name</label>
              <input
                type="text"
                name="roleName"
                value={formData.roleName}
                onChange={handleFormChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {isEditing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="mb-4 flex space-x-4 items-center">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search..."
          className="w-full max-w-lg py-3 mt-6 px-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex space-x-4">
          <div>
            <label className="block text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={startDate}
              onChange={handleDateChange}
              className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              value={endDate}
              onChange={handleDateChange}
              className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      <div className="mb-4 text-gray-600">Total Roles: {total}</div>
      <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="border-b-2 border-gray-300 p-4 text-left">S.No</th>
            <th className="border-b-2 border-gray-300 p-4 text-left">Role Name</th>
            <th className="border-b-2 border-gray-300 p-4 text-left">Description</th>
            <th className="border-b-2 border-gray-300 p-4 text-left">Created On</th>
            <th className="border-b-2 border-gray-300 p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoles?.map((role, index) => {
            const serialNumber = (page - 1) * pageSize + index + 1;
            return (
              <tr key={`${role.id}-${index}`} className="hover:bg-gray-100 transition-colors duration-200">
                <td className="border-b border-gray-200 p-4">{serialNumber}</td>
                <td className="border-b border-gray-200 p-4">{role.roleName}</td>
                <td className="border-b border-gray-200 p-4">{role.description}</td>
                <td className="border-b border-gray-200 p-4">{new Date(role.createdOn).toLocaleString()}</td>
                <td className="border-b border-gray-200 p-4 text-center">
                  <div className="flex justify-center space-x-4">
                    <Edit size={20} className="text-blue-600 hover:text-blue-800 cursor-pointer" onClick={() => handleEdit(role)} />
                    <Trash2 size={20} className="text-red-600 hover:text-red-800 cursor-pointer" onClick={() => handleDelete(serialNumber)} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Previous
        </button>
        <span className="text-lg text-gray-700">Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page * pageSize >= total}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RolesList;