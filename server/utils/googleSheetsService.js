// server/utils/googleSheetsService.js
const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const path = require('path');
const CREDENTIALS_PATH = path.resolve(__dirname, '..', process.env.GOOGLE_CREDENTIALS_PATH);
const keys = require(CREDENTIALS_PATH);

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const auth = new google.auth.JWT({
  email: keys.client_email,
  key: keys.private_key,
  scopes: SCOPES,
});

const sheets = google.sheets({ version: 'v4', auth });

async function readSheet(sheetId, range) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });
  return res.data.values;
}

async function updateRow(sheetId, range, row) {
  const res = await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [row],
    },
  });
  return res;
}

async function appendRow(sheetId, range, row) {
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [row],
    },
  });
  return res;
}

async function deleteRow(sheetId, rowIndex) {
  console.log(rowIndex)
  const res = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    resource: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: 0,
            dimension: 'ROWS',
            startIndex: rowIndex - 1,
            endIndex: rowIndex
          }
        }
      }]
    },
  });
  return res;
}

async function ensureHeaders(sheetId, range, headers) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  const firstRow = res.data.values?.[0];
  if (!firstRow || firstRow.length < headers.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [headers],
      },
    });
  }
}

async function getTotalRowCount(sheetId, sheetName, process = false) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetName}!Z1`, // Or wherever you placed =COUNTA(A2:A)
  });
  if(process){
    const check = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!N2`, // Or wherever you placed =COUNTA(A2:A)
    });
    process = check.data.values?.[0]?.[0] == "#N/A";
  }
  return parseInt(
  process == false 
    ? res.data.values?.[0]?.[0] || '0' 
    : '0'
);
}

module.exports = { readSheet, appendRow, updateRow, deleteRow, ensureHeaders, getTotalRowCount };
