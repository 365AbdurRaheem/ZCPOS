const express = require('express');
const router = express.Router();
const { readSheet, appendRow, ensureHeaders, updateRow, deleteRow, getTotalRowCount } = require('../utils/googleSheetsService');
const GatePass = require('../models/GatePass');

const SHEET_ID = 'your-id'; // Gate Pass Sheet ID
const RANGE = 'Sheet1!A2:M';
const HEADERS = ['ID', 'ArticleName', 'ArticleNo', 'Name', 'Quantity', 'Total', 'Paid', 'Remaining', 'CreatedOn', 'PersonName', 'Source', 'Destination', 'GatePassType'];

// POST /api/gate-passes - Create Gate Pass
router.post('/', async (req, res) => {
  try {
    const {
      articleName,
      articleNo,
      name,
      quantity,
      total,
      paid,
      remaining,
      personName,
      source,
      destination,
      type
    } = req.body;

    if (!source) return res.status(400).json({ error: 'source is required' });
    if (!destination) return res.status(400).json({ error: 'destination is required' });
    if (!type) return res.status(400).json({ error: 'type is required' });

    await ensureHeaders(SHEET_ID, "Sheet1!A1:M", HEADERS);

    const gatePass = new GatePass({
      articleName,
      articleNo,
      name,
      quantity,
      total,
      paid,
      remaining,
      personName,
      source,
      destination,
      type
    });

    await appendRow(SHEET_ID, RANGE, [
      gatePass.id,
      gatePass.articleName,
      gatePass.articleNo,
      gatePass.name,
      gatePass.quantity,
      gatePass.total,
      gatePass.paid,
      gatePass.remaining,
      gatePass.createdOn,
      gatePass.person,
      gatePass.source,
      gatePass.destination,
      gatePass.gatePassType
    ]);

    res.status(201).json({ message: 'Gate pass created', gatePass });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/gate-passes - Read All Gate Passes (No Pagination)
router.get('/', async (req, res) => {
  try {
    const type = req.query.type || '';
    
    const range = 'Sheet1!A2:M'; // Skip header row
    const data = await readSheet(SHEET_ID, range);

    let gatePasses = data?.map(row => ({
      id: row[0] || '',
      articleName: row[1] || '',
      articleNo: row[2] || '',
      name: row[3] || '',
      quantity: Number(row[4]) || 0,
      total: Number(row[5]) || 0,
      paid: Number(row[6]) || 0,
      remaining: Number(row[7]) || 0,
      createdOn: row[8] || '',
      person: row[9] || '',
      source: row[10] || '',
      destination: row[11] || '',
      gatePassType: row[12] || ''
    })) || [];

    // Filter by type if provided
    if (type) {
      gatePasses = gatePasses.filter(gatePass =>
        gatePass.gatePassType.toLowerCase() === type.toLowerCase()
      );
    }

    res.json(gatePasses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/gate-passes/paginated - Read All Gate Passes with Pagination
router.get('/paginated', async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const search = req.query.search || '';
    const type = req.query.type || '';

    // Compute range for this page
    const startRow = (pageNumber - 1) * pageSize + 2; // +2 to skip header
    const endRow = startRow + pageSize - 1;
    const range = `Sheet1!A${startRow}:M${endRow}`;
    const data = await readSheet(SHEET_ID, range);
    
    let gatePasses = data?.map(row => ({
      id: row[0] || '',
      articleName: row[1] || '',
      articleNo: row[2] || '',
      name: row[3] || '',
      quantity: Number(row[4]) || 0,
      total: Number(row[5]) || 0,
      paid: Number(row[6]) || 0,
      remaining: Number(row[7]) || 0,
      createdOn: row[8] || '',
      person: row[9] || '',
      source: row[10] || '',
      destination: row[11] || '',
      gatePassType: row[12] || ''
    })) || [];

    // Filter by type if provided
    if (type) {
      gatePasses = gatePasses.filter(gatePass =>
        gatePass.gatePassType.toLowerCase() === type.toLowerCase()
      );
    }

    // Filter by search term
    if (search) {
      gatePasses = gatePasses.filter(gatePass =>
        gatePass.name.toLowerCase().includes(search.toLowerCase()) ||
        gatePass.articleName.toLowerCase().includes(search.toLowerCase()) ||
        gatePass.person.toLowerCase().includes(search.toLowerCase()) ||
        gatePass.source.toLowerCase().includes(search.toLowerCase()) ||
        gatePass.destination.toLowerCase().includes(search.toLowerCase()) ||
        gatePass.gatePassType.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = await getTotalRowCount(SHEET_ID, 'Sheet1');

    res.json({
      total,
      pageNumber,
      pageSize,
      gatePasses
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/gate-passes/:id - Update Gate Pass
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      articleName,
      articleNo,
      name,
      quantity,
      total,
      paid,
      remaining,
      personName,
      source,
      destination,
      type
    } = req.body;

    const data = await readSheet(SHEET_ID, RANGE);
    const index = data?.findIndex(row => row[0] === id);

    if (index === -1) return res.status(404).json({ error: 'Gate pass not found' });

    const existingRow = data[index];
    
    // Create updated gate pass to validate inputs
    const updatedGatePass = new GatePass({
      articleName: articleName || existingRow[1] || '',
      articleNo: articleNo || existingRow[2] || '',
      name: name || existingRow[3] || '',
      quantity: quantity || Number(existingRow[4]) || 0,
      total: total || Number(existingRow[5]) || 0,
      paid: paid || Number(existingRow[6]) || 0,
      remaining: remaining || Number(existingRow[7]) || 0,
      createdOn: existingRow[8] || new Date().toISOString(),
      personName: personName || existingRow[9] || '',
      source: source || existingRow[10] || '',
      destination: destination || existingRow[11] || '',
      type: type || existingRow[12] || ''
    });

    const updatedRow = [
      id,
      updatedGatePass.articleName,
      updatedGatePass.articleNo,
      updatedGatePass.name,
      updatedGatePass.quantity,
      updatedGatePass.total,
      updatedGatePass.paid,
      updatedGatePass.remaining,
      updatedGatePass.createdOn,
      updatedGatePass.person,
      updatedGatePass.source,
      updatedGatePass.destination,
      updatedGatePass.gatePassType
    ];

    await updateRow(SHEET_ID, `Sheet1!A${index + 2}`, updatedRow);
    res.json({ message: 'Gate pass updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/gate-passes/:id - Soft Delete Gate Pass (blank row)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = await readSheet(SHEET_ID, RANGE);
    const index = data?.findIndex(row => row[0] === id);

    if (index === -1) return res.status(404).json({ error: 'Gate pass not found' });

    await deleteRow(SHEET_ID, index + 2);

    res.json({ message: 'Gate pass deleted (row removed)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;