const express = require('express');
const router = express.Router();
const { readSheet, appendRow, ensureHeaders, updateRow, deleteRow, getTotalRowCount } = require('../utils/googleSheetsService');
const ProcessingStage = require('../models/ProcessingStage');

const SHEET_ID = '1BJ9D4WplWck7wFSkWfcomU9W5mJOreBnkkRn-lb7uv4'; // Processing Stages
const RANGE = 'Sheet1!A2:L';
const HEADERS = ['ID', 'ArticleName', 'ArticleNo', 'Name', 'Quantity', 'Total', 'Paid', 'Remaining', 'CreatedOn', 'PersonName', 'Stage', 'Status'];

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
      personName,
      condition,
      status
    } = req.body;

    if (!name) return res.status(400).json({ error: 'name is required' });
    if (!personName) return res.status(400).json({ error: 'personName is required' });
    if (!condition) return res.status(400).json({ error: 'condition is required' });
    if (!status) return res.status(400).json({ error: 'status is required' });

    await ensureHeaders(SHEET_ID, "Sheet1!A1:L", HEADERS);

    const processingStage = new ProcessingStage({
      articleName,
      articleNo,
      name,
      quantity,
      total,
      paid,
      remaining,
      personName,
      condition,
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
      processingStage.stage,
      processingStage.status
    ]);

    res.status(201).json({ message: 'Processing stage created', processingStage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/processing-stages - Read All Processing Stages (No Pagination)
router.get('/', async (req, res) => {
  try {
    const stage = req.query.stage || '';
    
    const range = 'Sheet1!A2:L'; // Skip header row
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

    // Filter by stage if provided
    if (stage) {
      processingStages = processingStages.filter(processingStage =>
        processingStage.stage.toLowerCase() === stage.toLowerCase()
      );
    }

    res.json(processingStages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/processing-stages - Read All Processing Stages with Pagination
router.get('/paginated', async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const search = req.query.search || '';
    const stage = req.query.stage || '';

    // Compute range for this page
    const startRow = (pageNumber - 1) * pageSize + 2; // +2 to skip header
    const endRow = startRow + pageSize - 1;
    const range = `Sheet1!A${startRow}:L${endRow}`;
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

    // Filter by stage if provided
    if (stage) {
      processingStages = processingStages.filter(processingStage =>
        processingStage.stage.toLowerCase() === stage.toLowerCase()
      );
    }

    // Filter by search term
    if (search) {
      processingStages = processingStages.filter(processingStage =>
        processingStage.name.toLowerCase().includes(search.toLowerCase()) ||
        processingStage.articleName.toLowerCase().includes(search.toLowerCase()) ||
        processingStage.person.toLowerCase().includes(search.toLowerCase()) ||
        processingStage.stage.toLowerCase().includes(search.toLowerCase()) ||
        processingStage.status.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = await getTotalRowCount(SHEET_ID, 'Sheet1');

    res.json({
      total,
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
    const {
      articleName,
      articleNo,
      name,
      quantity,
      total,
      paid,
      remaining,
      personName,
      condition,
      status
    } = req.body;

    const data = await readSheet(SHEET_ID, RANGE);
    const index = data?.findIndex(row => row[0] === id);

    if (index === -1) return res.status(404).json({ error: 'Processing stage not found' });

    const existingRow = data[index];
    
    // Create updated processing stage to validate inputs
    const updatedProcessingStage = new ProcessingStage({
      articleName: articleName || existingRow[1] || '',
      articleNo: articleNo || existingRow[2] || '',
      name: name || existingRow[3] || '',
      quantity: quantity || Number(existingRow[4]) || 0,
      total: total || Number(existingRow[5]) || 0,
      paid: paid || Number(existingRow[6]) || 0,
      remaining: remaining || Number(existingRow[7]) || 0,
      createdOn: existingRow[8] || new Date().toISOString(),
      personName: personName || existingRow[9] || '',
      condition: condition || existingRow[10] || '',
      status: status || existingRow[11] || ''
    });

    const updatedRow = [
      id,
      updatedProcessingStage.articleName,
      updatedProcessingStage.articleNo,
      updatedProcessingStage.name,
      updatedProcessingStage.quantity,
      updatedProcessingStage.total,
      updatedProcessingStage.paid,
      updatedProcessingStage.remaining,
      updatedProcessingStage.createdOn,
      updatedProcessingStage.person,
      updatedProcessingStage.stage,
      updatedProcessingStage.status
    ];

    await updateRow(SHEET_ID, `Sheet1!A${index + 2}`, updatedRow);
    res.json({ message: 'Processing stage updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/processing-stages/:id - Soft Delete Processing Stage (blank row)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = await readSheet(SHEET_ID, RANGE);
    const index = data?.findIndex(row => row[0] === id);

    if (index === -1) return res.status(404).json({ error: 'Processing stage not found' });

    await deleteRow(SHEET_ID, index + 2);

    res.json({ message: 'Processing stage deleted (row removed)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;