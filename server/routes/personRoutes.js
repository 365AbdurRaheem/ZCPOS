// routes/personRoutes.js
const express = require('express');
const router = express.Router();
const {
  readSheet,
  appendRow,
  ensureHeaders,
  updateRow,
  deleteRow,
  getTotalRowCount
} = require('../utils/googleSheetsService');
const Person = require('../models/Person');

const SHEET_ID = '1k_dNq0zBNwb8hMmEFQMaMlB0A79n2ZIlEUdIYjL_jeY'; // Persons
const RANGE = 'Sheet1!A2:H';
const HEADERS = ['ID', 'Name', 'Role', 'CNIC', 'Phone', 'Email', 'Address', 'CreatedOn'];

// POST /api/persons - Create Person
router.post('/', async (req, res) => {
  try {
    const { name, roleName, cnic, phone, email, address } = req.body;

    if (!name || !roleName || !phone) {
      return res.status(400).json({ error: 'name, roleName, and phone are required' });
    }

    await ensureHeaders(SHEET_ID, 'Sheet1!A1:H', HEADERS);
    const data = await readSheet(SHEET_ID, RANGE);

    const person = new Person({
      id: `ID-${Date.now()}`,
      name,
      roleName,
      cnic,
      phone,
      email,
      address,
      createdOn: new Date().toISOString()
    });

    await appendRow(SHEET_ID, RANGE, [
      person.id,
      person.name,
      person.role,
      person.cnic,
      person.phone,
      person.email,
      person.address,
      person.createdOn
    ]);

    res.status(201).json({ message: 'Person created', person });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/persons?roleName=SomeRole - Get Persons by RoleName (No Pagination)
router.get('/', async (req, res) => {
  try {
    const { roleName } = req.query;
    const range = 'Sheet1!A2:H'; // Skip header row
    const data = await readSheet(SHEET_ID, range);

    let persons = data?.map(row => ({
      id: row[0] || '',
      name: row[1] || '',
      role: row[2] || '',
      cnic: row[3] || '',
      phone: row[4] || '',
      email: row[5] || '',
      address: row[6] || '',
      createdOn: row[7] || ''
    })) || [];

    if (roleName) {
      persons = persons.filter(p => p.role.toLowerCase() == roleName.toLowerCase());
    }

    res.json(persons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/persons - Read All Persons with Pagination + Search + roleName filter
router.get('/paginated', async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const search = req.query.search || '';
    const roleNameFilter = req.query.roleName || ''; // From query

    const startRow = (pageNumber - 1) * pageSize + 2;
    const endRow = startRow + pageSize - 1;
    const range = `Sheet1!A${startRow}:H${endRow}`;

    let data = await readSheet(SHEET_ID, range);

    let persons = data?.map(row => ({
      id: row[0] || '',
      name: row[1] || '',
      role: row[2] || '',
      cnic: row[3] || '',
      phone: row[4] || '',
      email: row[5] || '',
      address: row[6] || '',
      createdOn: row[7] || ''
    })) || [];

    // Apply optional roleName filter
    if (roleNameFilter) {
      persons = persons.filter(p => p.role.toLowerCase() === roleNameFilter.toLowerCase());
    }

    // Apply optional search filter
    if (search) {
      persons = persons.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.role.toLowerCase().includes(search.toLowerCase()) ||
        p.phone.includes(search) ||
        p.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = await getTotalRowCount(SHEET_ID, 'Sheet1');

    res.json({
      total,
      pageNumber,
      pageSize,
      persons
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/persons/:id - Update Person
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, roleName, cnic, phone, email, address } = req.body;

    const data = await readSheet(SHEET_ID, RANGE);
    const index = data?.findIndex(row => row[0] === id);

    if (index === -1) return res.status(404).json({ error: 'Person not found' });

    const existingRow = data[index];

    const updatedRow = [
      id,
      name || existingRow[1],
      roleName || existingRow[2],
      cnic || existingRow[3],
      phone || existingRow[4],
      email || existingRow[5],
      address || existingRow[6],
      existingRow[7] || new Date().toISOString()
    ];

    await updateRow(SHEET_ID, `Sheet1!A${index + 2}`, updatedRow);
    res.json({ message: 'Person updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/persons/:id - Soft Delete
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = await readSheet(SHEET_ID, RANGE);
    const index = data?.findIndex(row => row[0] === id);

    if (index === -1) return res.status(404).json({ error: 'Person not found' });

    await deleteRow(SHEET_ID, index + 2);

    res.json({ message: 'Person deleted (row removed)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
