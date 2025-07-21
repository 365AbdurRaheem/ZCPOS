import React, { useState, useEffect } from 'react';
import BASE_URL from '../config';
import { Edit, Trash2, Plus } from 'lucide-react';

interface ProcessingStage {
  id: string;
  articleName: string;
  articleNo: string;
  name: string;
  quantity: number;
  total: number;
  paid: number;
  remaining: number;
  createdOn: string;
  personName: string;
  condition: string;
  status: string;
}

const RawList: React.FC = () => {
  const [stages, setStages] = useState<ProcessingStage[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProcessingStage>({
    id: '',
    articleName: '',
    articleNo: '',
    name: '',
    quantity: 0,
    total: 0,
    paid: 0,
    remaining: 0,
    createdOn: '',
    personName: '',
    condition: '',
    status: ''
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    fetchStages();
    fetchTotal();
  }, [page, search]);

  const fetchStages = async () => {
    const url = search
      ? `${BASE_URL}/api/processing-stages`
      : `${BASE_URL}/api/processing-stages/paginated?pageNumber=${page}&pageSize=${pageSize}`;
    const response = await fetch(url);
    const data = await response.json();
    setStages(data.processingStages || []);
  };

  const fetchTotal = async () => {
    const response = await fetch(`${BASE_URL}/api/processing-stages/total`);
    const data = await response.json();
    setTotal(data.total || 0);
  };

  const handleDelete = async (serialNumber: number) => {
    if (confirm(`Do you want to delete processing stage ${serialNumber}?`)) {
      try {
        await fetch(`${BASE_URL}/api/processing-stages/${serialNumber - 1}`, { method: 'DELETE' });
        await fetchStages();
        await fetchTotal();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleEdit = (stage: ProcessingStage) => {
    setFormData(stage);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({
      id: '',
      articleName: '',
      articleNo: '',
      name: '',
      quantity: 0,
      total: 0,
      paid: 0,
      remaining: 0,
      createdOn: new Date().toISOString(),
      personName: '',
      condition: '',
      status: ''
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing ? `${BASE_URL}/api/processing-stages/${formData.id}` : `${BASE_URL}/api/processing-stages`;
      const method = isEditing ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      await fetchStages();
      await fetchTotal();
      setShowForm(false);
      setFormData({
        id: '',
        articleName: '',
        articleNo: '',
        name: '',
        quantity: 0,
        total: 0,
        paid: 0,
        remaining: 0,
        createdOn: '',
        personName: '',
        condition: '',
        status: ''
      });
    } catch (error) {
      console.error(`${isEditing ? 'Edit' : 'Add'} failed:`, error);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'quantity' || name === 'total' || name === 'paid' || name === 'remaining' ? Number(value) : value });
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

  const filteredStages = stages?.filter(stage => {
    const matchesSearch =
      stage.articleName.toLowerCase().includes(search.toLowerCase()) ||
      stage.articleNo.toLowerCase().includes(search.toLowerCase()) ||
      stage.name.toLowerCase().includes(search.toLowerCase()) ||
      stage.personName.toLowerCase().includes(search.toLowerCase());
    const stageDate = new Date(stage.createdOn);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const matchesDate = (!start || stageDate >= start) && (!end || stageDate <= end);
    return matchesSearch && matchesDate;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-gray-800 border-b-2 border-gray-300 pb-2">Processing Stages Management</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 flex items-center"
        >
          <Plus size={20} className="mr-2" /> Add Stage
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Stage' : 'Add Stage'}</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700">Article Name</label>
                <input
                  type="text"
                  name="articleName"
                  value={formData.articleName}
                  onChange={handleFormChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Article No</label>
                <input
                  type="text"
                  name="articleNo"
                  value={formData.articleNo}
                  onChange={handleFormChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
                <label className="block text-gray-700">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Total</label>
                <input
                  type="number"
                  name="total"
                  value={formData.total}
                  onChange={handleFormChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Paid</label>
                <input
                  type="number"
                  name="paid"
                  value={formData.paid}
                  onChange={handleFormChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Remaining</label>
                <input
                  type="number"
                  name="remaining"
                  value={formData.remaining}
                  onChange={handleFormChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Person Name</label>
                <input
                  type="text"
                  name="personName"
                  value={formData.personName}
                  onChange={handleFormChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleFormChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Condition</option>
                  <option value="raw">Raw</option>
                  <option value="embroidery">Embroidery</option>
                  <option value="filling">Filling</option>
                  <option value="cutting">Cutting</option>
                  <option value="stitching">Stitching</option>
                  <option value="pressing">Pressing</option>
                  <option value="packing">Packing</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                cidades
              </div>
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
          placeholder="Search by article, name, or person..."
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
      <div className="mb-4 text-gray-600">Total Stages: {total}</div>
      <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="border-b-2 border-gray-300 p-4 text-left">S.No</th>
            <th className="border-b-2 border-gray-300 p-4 text-left">Article Name</th>
            <th className="border-b-2 border-gray-300 p-4 text-left">Article No</th>
            <th className="border-b-2 border-gray-300 p-4 text-left">Name</th>
            <th className="border-b-2 border-gray-300 p-4 text-left">Quantity</th>
            <th className="border-b-2 border-gray-300 p-4 text-left">Total</th>
            <th className="border-b-2 border-gray-300 p-4 text-left">Paid</th>
            <th className="border-b-2 border-gray-300 p-4 text-left">Remaining</th>
            <th className="border-b-2 border-gray-300 p-4 text-left">Created On</th>
            <th className="border-b-2 border-gray-300 p-4 text-left">Person</th>
            <th className="border-b-2 border-gray-300 p-4 text-left">Condition</th>
            <th className="border-b-2 border-gray-300 p-4 text-left">Status</th>
            <th className="border-b-2 border-gray-300 p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStages?.map((stage: ProcessingStage, index: number) => {
            const serialNumber = (page - 1) * pageSize + index + 1;
            return (
              <tr key={`${stage.id}-${index}`} className="hover:bg-gray-100 transition-colors duration-200">
                <td className="border-b border-gray-200 p-4">{serialNumber}</td>
                <td className="border-b border-gray-200 p-4">{stage.articleName}</td>
                <td className="border-b border-gray-200 p-4">{stage.articleNo}</td>
                <td className="border-b border-gray-200 p-4">{stage.name}</td>
                <td className="border-b border-gray-200 p-4">{stage.quantity}</td>
                <td className="border-b border-gray-200 p-4">{stage.total}</td>
                <td className="border-b border-gray-200 p-4">{stage.paid}</td>
                <td className="border-b border-gray-200 p-4">{stage.remaining}</td>
                <td className="border-b border-gray-200 p-4">{new Date(stage.createdOn).toLocaleString()}</td>
                <td className="border-b border-gray-200 p-4">{stage.personName}</td>
                <td className="border-b border-gray-200 p-4">{stage.condition}</td>
                <td className="border-b border-gray-200 p-4">{stage.status}</td>
                <td className="border-b border-gray-200 p-4 text-center">
                  <div className="flex justify-center space-x-4">
                    <Edit size={20} className="text-blue-600 hover:text-blue-800 cursor-pointer" onClick={() => handleEdit(stage)} />
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

export default RawList;