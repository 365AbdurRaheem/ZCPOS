const express = require('express');
const router = express.Router();
const { readSheet, appendRow, ensureHeaders, updateRow, deleteRow, getTotalRowCount } = require('../utils/googleSheetsService');
const Role = require('../models/Role');

const SHEET_ID = '1j4900WCzjxG2IfzTUZWdC6un7kEtGoY8onMW71A9YGw'; // Roles Sheet ID
const RANGE = 'Sheet1!A2:D';
const HEADERS = ['ID', 'RoleName', 'Description', 'CreatedOn'];

// POST /api/roles - Create Role
router.post('/', async (req, res) => {
  try {
    const { roleName, description } = req.body;
    if (!roleName) return res.status(400).json({ error: 'roleName is required' });

    await ensureHeaders(SHEET_ID, "Sheet1!A1:D", HEADERS);
    const data = await readSheet(SHEET_ID, RANGE);

    const exists = data?.some(row => (row[1] || '').toLowerCase() === roleName.toLowerCase());
    if (exists) return res.status(400).json({ error: 'Role already exists' });

    const role = new Role({
      id: `ID-${Date.now()}`,
      roleName,
      description
    });

    await appendRow(SHEET_ID, RANGE, [
      role.id,
      role.roleName,
      role.description,
      role.createdOn
    ]);

    res.status(201).json({ message: 'Role created', role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/roles - Read All Roles (No Pagination)

router.get('/', async (req, res) => {
  try {
    const range = 'Sheet1!A2:D'; // Skip header row
    const data = await readSheet(SHEET_ID, range);

    const roles = data?.map(row => ({
      id: row[0] || '',
      roleName: row[1] || '',
      description: row[2] || '',
      createdOn: row[3] || ''
    })) || [];

    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET /api/roles - Read All Roles with Pagniation

router.get('/paginated', async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const search = req.query.search || '';

    // Compute range for this page
    const startRow = (pageNumber - 1) * pageSize + 2; // +2 to skip header
    const endRow = startRow + pageSize - 1;
    const range = `Sheet1!A${startRow}:D${endRow}`;
    const data = await readSheet(SHEET_ID, range);
    let roles = data?.map(row => ({
      id: row[0] || '',
      roleName: row[1] || '',
      description: row[2] || '',
      createdOn: row[3] || ''
    })) || [];

    if (search) {
      roles = roles.filter(role =>
        role.roleName.toLowerCase().includes(search.toLowerCase()) ||
        role.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = await getTotalRowCount(SHEET_ID, 'Sheet1');

    res.json({
      total,
      pageNumber,
      pageSize,
      roles
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/roles/:id - Update Role
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName, description } = req.body;

    const data = await readSheet(SHEET_ID, RANGE);
    const index = data?.findIndex(row => row[0] === id);

    if (index === -1) return res.status(404).json({ error: 'Role not found' });

    const existingRow = data[index];
    const updatedRow = [
      id,
      roleName || existingRow[1] || '',
      description || existingRow[2] || '',
      existingRow[3] || new Date().toISOString()
    ];

    await updateRow(SHEET_ID, `Sheet1!A${index + 2}`, updatedRow);
    res.json({ message: 'Role updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/roles/:id - Soft Delete Role (blank row)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = await readSheet(SHEET_ID, RANGE);
    const index = data?.findIndex(row => row[0] === id);

    if (index === -1) return res.status(404).json({ error: 'Role not found' });

    await deleteRow(SHEET_ID, index + 2);

    res.json({ message: 'Role deleted (row removed)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
