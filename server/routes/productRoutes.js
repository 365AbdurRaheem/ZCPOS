const express = require('express');
const router = express.Router();
const { readSheet, appendRow, ensureHeaders, updateRow, deleteRow, getTotalRowCount } = require('../utils/googleSheetsService');
const Product = require('../models/Product');

const SHEET_ID = '1jCqnt5ZNlfd-3-K1sLRVmpIWXNpf6z5zeuqsEoajCTU'; // Product
const RANGE = 'Sheet1!A2:J';
const HEADERS = ['ID', 'ArticleName', 'ArticleNo', 'ProductName', 'Quantity', 'Total', 'Paid', 'Remaining', 'CreatedOn', 'BarcodeNumber'];

// POST /api/products - Create Product
router.post('/', async (req, res) => {
  try {
    const {
      articleName,
      articleNo,
      productName,
      quantity,
      total,
      paid,
      remaining,
      barcodeNumber
    } = req.body;

    if (!productName) return res.status(400).json({ error: 'name is required' });
    if (!barcodeNumber) return res.status(400).json({ error: 'barcodeNumber is required' });

    // await ensureHeaders(SHEET_ID, "Sheet1!A1:J", HEADERS);
    // const data = await readSheet(SHEET_ID, RANGE);

    // Check if barcode already exists
    // const exists = data?.some(row => (row[10] || '').toLowerCase() === barcodeNumber.toLowerCase());
    // if (exists) return res.status(400).json({ error: 'Product with this barcode already exists' });

    const product = new Product({
      articleName,
      articleNo,
      productName,
      quantity,
      total,
      paid,
      remaining,
      barcodeNumber
    });

    await appendRow(SHEET_ID, RANGE, [
      product.id,
      product.articleName,
      product.articleNo,
      product.productName,
      product.quantity,
      product.total,
      product.paid,
      product.remaining,
      product.createdOn,
      product.barcodeNumber
    ]);

    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/total', async (req, res) => {
  try {
    const total = await getTotalRowCount(SHEET_ID, 'Sheet1');
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch total rows' });
  }
});

// GET /api/products - Read All Products (No Pagination)
router.get('/', async (req, res) => {
  try {
    const range = 'Sheet1!A2:J'; // Skip header row
    const data = await readSheet(SHEET_ID, range);

    const products = data?.map(row => ({
      id: row[0] || '',
      articleName: row[1] || '',
      articleNo: row[2] || '',
      productName: row[3] || '',
      quantity: Number(row[4]) || 0,
      total: Number(row[5]) || 0,
      paid: Number(row[6]) || 0,
      remaining: Number(row[7]) || 0,
      createdOn: row[8] || '',
      barcodeNumber: row[9] || ''
    })) || [];

    res.json({ products : products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/paginated - Read All Products with Pagination
router.get('/paginated', async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    // Compute range for this page
    const startRow = (pageNumber - 1) * pageSize + 2; // +2 to skip header
    const endRow = startRow + pageSize - 1;
    const range = `Sheet1!A${startRow}:J${endRow}`;
    const data = await readSheet(SHEET_ID, range);
    
    let products = data?.map(row => ({
      id: row[0] || '',
      articleName: row[1] || '',
      articleNo: row[2] || '',
      productName: row[3] || '',
      quantity: Number(row[4]) || 0,
      total: Number(row[5]) || 0,
      paid: Number(row[6]) || 0,
      remaining: Number(row[7]) || 0,
      createdOn: row[8] || '',
      barcodeNumber: row[9] || ''
    })) || [];

    res.json({
      total,
      pageNumber,
      pageSize,
      products
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id - Update Product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      articleName,
      articleNo,
      productName,
      quantity,
      total,
      paid,
      remaining,
      barcodeNumber
    } = req.body;

    const data = await readSheet(SHEET_ID, RANGE);
    const index = data?.findIndex(row => row[0] === id);

    if (index === -1) return res.status(404).json({ error: 'Product not found' });

    const existingRow = data[index];
    
    // Check if barcode already exists (excluding current product)
    // if (barcodeNumber && barcodeNumber !== existingRow[10]) {
    //   const exists = data?.some((row, i) => i !== index && (row[10] || '').toLowerCase() === barcodeNumber.toLowerCase());
    //   if (exists) return res.status(400).json({ error: 'Product with this barcode already exists' });
    // }
    
    // Create updated product to validate inputs
    const updatedProduct = new Product({
      articleName: articleName || existingRow[1] || '',
      articleNo: articleNo || existingRow[2] || '',
      productName: productName || existingRow[3] || '',
      quantity: quantity || Number(existingRow[4]) || 0,
      total: total || Number(existingRow[5]) || 0,
      paid: paid || Number(existingRow[6]) || 0,
      remaining: remaining || Number(existingRow[7]) || 0,
      createdOn: existingRow[8] || new Date().toISOString(),
      barcodeNumber: barcodeNumber || existingRow[9] || ''
    });

    const updatedRow = [
      id,
      updatedProduct.articleName,
      updatedProduct.articleNo,
      updatedProduct.productName,
      updatedProduct.quantity,
      updatedProduct.total,
      updatedProduct.paid,
      updatedProduct.remaining,
      updatedProduct.createdOn,
      updatedProduct.barcodeNumber
    ];

    await updateRow(SHEET_ID, `Sheet1!A${index + 2}`, updatedRow);
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:index
router.delete('/:index', async (req, res) => {
  try {
    const index = parseInt(req.params.index)
    if (index === -1) return res.status(404).json({ error: 'Product not found' });
    await deleteRow(SHEET_ID, index + 2);
    res.json({ message: 'Product deleted (row removed)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;