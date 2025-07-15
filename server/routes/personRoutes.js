const express = require('express');
const router = express.Router();
const { readSheet, appendRow, ensureHeaders } = require('../utils/googleSheetsService');

const SHEET_ID = '1k_dNq0zBNwb8hMmEFQMaMlB0A79n2ZIlEUdIYjL_jeY';       // Persons Sheet
const ROLES_SHEET_ID = '1j4900WCzjxG2IfzTUZWdC6un7kEtGoY8onMW71A9YGw'; // Roles Sheet

const PERSON_RANGE = 'Sheet1!A1';  // Persons data range
const ROLE_RANGE = 'Sheet1!A2:B';  // Roles data range — adjust sheet name if needed

// GET /api/persons?roleId=SUP
router.get('/', async (req, res) => {
  const { roleId } = req.query;

  if (!roleId) {
    return res.status(400).json({ error: 'roleId is required' });
  }

  try {
    const rows = await readSheet(SHEET_ID, PERSON_RANGE);

    const persons = rows
      .map(row => ({
        id: row[0],
        articleName: row[1],
        articleNo: row[2],
        name: row[3],
        quantity: Number(row[4]),
        price: Number(row[5]),
        createdOn: row[6],
        roleId: row[7],
        cnic: row[8],
        phone: row[9],
        address: row[10]
      }))
      .filter(person => person.roleId === roleId.toUpperCase());

    res.status(200).json(persons);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/persons
router.post('/', async (req, res) => {
  try {
    const {
      articleName,
      articleNo,
      name,
      quantity,
      price,
      roleId,
      cnic,
      phone,
      address
    } = req.body;

    // Step 1: Validate required fields
    if (!name || !roleId || !cnic || !phone || !address) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Step 2: FK check: roleId must exist in Roles sheet (different sheet ID)
    const roles = await readSheet(ROLES_SHEET_ID, ROLE_RANGE);
    console.log(roles)
    const roleExists = roles.some(row => row[0] === roleId.toUpperCase());
    console.log(roleExists)

    if (!roleExists) {
      return res.status(400).json({ error: `roleId "${roleId}" does not exist in Roles` });
    }

    // Step 3: Construct row
    const id = `ID-${Date.now()}`;
    const createdOn = new Date().toISOString();

    const row = [
      id,
      articleName || '',
      articleNo || '',
      name,
      quantity || 0,
      price || 0,
      createdOn,
      roleId,
      cnic,
      phone,
      address
    ];

    // Step 4: Ensure headers
    await ensureHeaders(SHEET_ID, PERSON_RANGE, [
      'id', 'articleName', 'articleNo', 'name', 'quantity', 'price', 'createdOn', 'roleId', 'cnic', 'phone', 'address'
    ]);

    // Step 5: Append
    await appendRow(SHEET_ID, PERSON_RANGE, row);

    res.status(201).json({ message: 'Person created successfully', id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
