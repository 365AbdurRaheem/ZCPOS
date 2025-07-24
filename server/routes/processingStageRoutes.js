const express = require('express');
const router = express.Router();
const { readSheet, appendRow, ensureHeaders, updateRow, deleteRow, getTotalRowCount } = require('../utils/googleSheetsService');
const ProcessingStage = require('../models/ProcessingStage');

const SHEET_ID = '1BJ9D4WplWck7wFSkWfcomU9W5mJOreBnkkRn-lb7uv4'; // Processing Stages
const RANGE = 'Sheet1!A2:L';
// const HEADERS = ['ID', 'ArticleName', 'ArticleNo', 'Name', 'Quantity', 'Total', 'Paid', 'Remaining', 'CreatedOn', 'PersonName', 'Stage', 'Status'];

// POST /api/processing-stages - Create Processing Stage
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
      person,
      stage,
      status
    } = req.body;
console.log(req.body)
    if (!name) return res.status(400).json({ error: 'name is required' });
    if (!person) return res.status(400).json({ error: 'personName is required' });
    if (!stage) return res.status(400).json({ error: 'condition is required' });
    if (!status) return res.status(400).json({ error: 'status is required' });

    // await ensureHeaders(SHEET_ID, "Sheet1!A1:L", HEADERS);

    const processingStage = new ProcessingStage({
      id: `ID-${Date.now()}`,
      articleName,
      articleNo,
      name,
      quantity,
      total,
      paid,
      remaining,
      person,
      condition : stage,
      status
    });

    await appendRow(SHEET_ID, RANGE, [
      processingStage.id,
      processingStage.articleName,
      processingStage.articleNo,
      processingStage.name,
      processingStage.quantity,
      processingStage.total,
      processingStage.paid,
      processingStage.remaining,
      processingStage.createdOn,
      processingStage.person,
      processingStage.condition,
      processingStage.status
    ]);

    res.status(201).json({ message: 'Processing stage created', processingStage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/total', async (req, res) => {
  try {
    const total = await getTotalRowCount(SHEET_ID, 'Sheet1', true);
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch total rows' });
  }
});

router.put('/formula/update/:condition', async (req, res) => {
  try {
    const { condition } = req.params;
    const formula = `=FILTER(A2:L, K2:K="${condition}")`;
    await updateRow(SHEET_ID, 'Sheet1!N2', [formula]);
    res.json({ message: 'Formula updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update formula' });
  }
});


// router.get('/formula/records', async (req, res) => {
//   try {
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: SHEET_ID,
//       range: 'Sheet1!N2:Z',
//     });
//     res.json({ total: response.data.values });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch records' });
//   }
// });

// GET /api/processing-stages - Read All Processing Stages (No Pagination)
router.get('/', async (req, res) => {
  try {
    const range = 'Sheet1!N2:Z';
    const data = await readSheet(SHEET_ID, range);

    let processingStages = data?.map(row => ({
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
      stage: row[10] || '',
      status: row[11] || ''
    })) || [];

    res.json({processingStages : processingStages});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/processing-stages - Read All Processing Stages with Pagination
router.get('/paginated', async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    // Compute range for this page
    const startRow = (pageNumber - 1) * pageSize + 2; // +2 to skip header
    const endRow = startRow + pageSize - 1;
    const range = `Sheet1!N${startRow}:Z${endRow}`;
    const data = await readSheet(SHEET_ID, range);

    let processingStages = data?.map(row => ({
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
      stage: row[10] || '',
      status: row[11] || ''
    })) || [];
    
    res.json({
      pageNumber,
      pageSize,
      processingStages
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// PUT /api/processing-stages/:id - Update Processing Stage
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { articleName, articleNo, name, quantity, total, paid, remaining, person, stage, status } = req.body;

    const data = await readSheet(SHEET_ID, RANGE);
    const index = data?.findIndex(row => row[0] === id);

    if (index === -1) return res.status(404).json({ error: 'Processing stage not found' });

    const existingRow = data[index];
    const updatedRow = [
      id,
      articleName || existingRow[1] || '',
      articleNo || existingRow[2] || '',
      name || existingRow[3] || '',
      quantity || Number(existingRow[4]) || 0,
      total || Number(existingRow[5]) || 0,
      paid || Number(existingRow[6]) || 0,
      remaining || Number(existingRow[7]) || 0,
      existingRow[8] || new Date().toISOString(),
      person || existingRow[9] || '',
      stage || existingRow[10] || '',
      status || existingRow[11] || ''
    ];

    await updateRow(SHEET_ID, `Sheet1!A${index + 2}`, updatedRow);
    res.json({ message: 'Processing stage updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/processingStages/:index
router.delete('/:index', async (req, res) => {
  try {
    const index = parseInt(req.params.index)
    if (index === -1) return res.status(404).json({ error: 'Processing Stage not found' });
    await deleteRow(SHEET_ID, index + 2);
    res.json({ message: 'Processing Stage deleted (row removed)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;