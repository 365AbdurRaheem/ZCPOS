const express = require('express');
const router = express.Router();
const { appendRow, readSheet } = require('../utils/googleSheetsService');

const SHEET_ID = '1jCqnt5ZNlfd-3-K1sLRVmpIWXNpf6z5zeuqsEoajCTU'; // Raw Material Table
const RANGE = 'Sheet1!A1'; // ⚠️ Sheet name and range

router.post('/', async (req, res) => {
  try {
    const { articleName, articleNo, name, quantity, price } = req.body;
    const row = [articleName, articleNo, name, quantity, price, new Date().toISOString()];
    await ensureHeaders(SHEET_ID, 'Sheet1!A1', ['articleName', 'articleNo', 'name', 'quantity', 'price', 'createdOn']);
    await appendRow(SHEET_ID, RANGE, row);
    res.status(201).json({ message: 'Raw material saved to Google Sheet' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await readSheet(SHEET_ID, RANGE);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
