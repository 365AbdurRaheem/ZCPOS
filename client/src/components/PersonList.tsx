import React, { useState, useEffect } from 'react';
import BASE_URL from '../config';
import { Edit, Trash2, Plus } from 'lucide-react';

const PersonList: React.FC = () => {
  const [persons, setPersons] = useState<{ id: string; name: string; roleName: string; cnic: string; phone: string; email: string; address: string; createdOn: string }[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [roleNames, setRoleNames] = useState<{ roleName: string }[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{ id: string; name: string; roleName: string; cnic: string; phone: string; email: string; address: string; createdOn: string }>({ id: '', name: '', roleName: '', cnic: '', phone: '', email: '', address: '', createdOn: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchPersons();
    fetchTotal();
    fetchRoleNames();
  }, [page, search]);

  const fetchPersons = async () => {
    const url = search
      ? `${BASE_URL}/api/persons`
      : `${BASE_URL}/api/persons/paginated?pageNumber=${page}&pageSize=${pageSize}`;
    const response = await fetch(url);
    const data = await response.json();
    setPersons(data.persons);
  };

  const fetchTotal = async () => {
    const response = await fetch(`${BASE_URL}/api/persons/total`);
    const data = await response.json();
    setTotal(data.total || 0);
  };

  const fetchRoleNames = async () => {
    const response = await fetch(`${BASE_URL}/api/roles/roleNames`);
    const data = await response.json();
    setRoleNames(data.roleNames || []);
  };

  const handleDelete = async (serialNumber: number) => {
    if (confirm(`Do you want to delete person ${serialNumber}?`)) {
      try {
        await fetch(`${BASE_URL}/api/persons/${serialNumber - 1}`, { method: 'DELETE' });
        await fetchPersons();
        await fetchTotal();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleEdit = (person: { id: string; name: string; roleName: string; cnic: string; phone: string; email: string; address: string; createdOn: string }) => {
    setFormData(person);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({ id: '', name: '', roleName: '', cnic: '', phone: '', email: '', address: '', createdOn: new Date().toISOString() });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing ? `${BASE_URL}/api/persons/${formData.id}` : `${BASE_URL}/api/persons`;
      const method = isEditing ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      await fetchPersons();
      await fetchTotal();
      setShowForm(false);
      setFormData({ id: '', name: '', roleName: '', cnic: '', phone: '', email: '', address: '', createdOn: '' });
    } catch (error) {
      console.error(`${isEditing ? 'Edit' : 'Add'} failed:`, error);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const filteredPersons = persons?.filter(person => {
    const matchesSearch = person.name?.toLowerCase().includes(search.toLowerCase()) ||
      person.roleName?.toLowerCase().includes(search.toLowerCase()) ||
      person.cnic?.toLowerCase().includes(search.toLowerCase()) ||
      person.phone?.toLowerCase().includes(search.toLowerCase()) ||
      person.email?.toLowerCase().includes(search.toLowerCase()) ||
      person.address?.toLowerCase().includes(search.toLowerCase());
    const personDate = new Date(person.createdOn);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const matchesDate = (!start || personDate >= start) && (!end || personDate <= end);
    return matchesSearch && matchesDate;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-gray-800 border-b-2 border-gray-300 pb-2">Persons Management</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 flex items-center"
        >
          <Plus size={20} className="mr-2" /> Add Person
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Person' : 'Add Person'}</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Role</label>
              <select
                name="roleName"
                value={formData.roleName}
                onChange={handleFormChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a role</option>
                {roleNames.map((role, index) => (
                  <option key={index} value={role.roleName}>{role.roleName}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">CNIC</label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleFormChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Address</label>
              <textarea
                name="address"
                value={formData.address}
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
      <div className="mb-4 text-gray-600">Total Persons: {total}</div>
      <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-scroll">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="border-b-2 border-gray-300 p-4 text-left">S.No</th>
            <th className="border-b-2 border-gray-300 p-4 text-left">Name</th>
            <th className="border-b-2 border-gray-300 p-4 text-left">Role</th>
            {/* <th className="border-b-2 border-gray-300 p-4 text-left">CNIC</th> */}
            <th className="border-b-2 border-gray-300 p-4 text-left">Phone</th>
            <th className="border-b-2 border-gray-300 p-4 text-left">Email</th>
            {/* <th className="border-b-2 border-gray-300 p-4 text-left">Address</th> */}
            <th className="border-b-2 border-gray-300 p-4 text-left">Created On</th>
            <th className="border-b-2 border-gray-300 p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPersons?.map((person, index) => {
            const serialNumber = (page - 1) * pageSize + index + 1;
            return (
              <tr key={`${person.id}-${index}`} className="hover:bg-gray-100 transition-colors duration-200">
                <td className="border-b border-gray-200 p-4">{serialNumber}</td>
                <td className="border-b border-gray-200 p-4">{person.name}</td>
                <td className="border-b border-gray-200 p-4">{person.roleName}</td>
                {/* <td className="border-b border-gray-200 p-4">{person.cnic}</td> */}
                <td className="border-b border-gray-200 p-4">{`0${person.phone}`}</td>
                <td className="border-b border-gray-200 p-4">{person.email}</td>
                {/* <td className="border-b border-gray-200 p-4">{person.address}</td> */}
                <td className="border-b border-gray-200 p-4">{new Date(person.createdOn).toLocaleString()}</td>
                <td className="border-b border-gray-200 p-4 text-center">
                  <div className="flex justify-center space-x-4">
                    <Edit size={20} className="text-blue-600 hover:text-blue-800 cursor-pointer" onClick={() => handleEdit(person)} />
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

export default PersonList;