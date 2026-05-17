/**
 * Google Apps Script CRUD for Fiqh Database
 * Spreadsheet structure: id | kategori | pertanyaan | jawaban | ibarot
 */

function doGet(e) {
  const action = e.parameter.action;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("masalah_fiqih");
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  const jsonData = data.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });

  if (action === "get") {
    const id = e.parameter.id;
    if (id) {
      const item = jsonData.find(i => String(i.id) === String(id));
      return outputJSON(item || {error: "Not found"});
    }
    return outputJSON(jsonData);
  }
  
  if (action === "search") {
    const query = e.parameter.q.toLowerCase();
    const result = jsonData.filter(i => 
      i.pertanyaan.toLowerCase().includes(query) || 
      i.jawaban.toLowerCase().includes(query) ||
      i.kategori.toLowerCase().includes(query)
    );
    return outputJSON(result);
  }

  return outputJSON(jsonData);
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const action = body.action;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("masalah_fiqih");
  
  if (action === "add") {
    const nextId = sheet.getLastRow() > 0 ? Number(sheet.getRange(sheet.getLastRow(), 1).getValue()) + 1 : 1;
    sheet.appendRow([
      nextId,
      body.kategori,
      body.pertanyaan,
      body.jawaban,
      body.ibarot
    ]);
    return outputJSON({success: true, id: nextId});
  }
  
  if (action === "edit") {
    const id = body.id;
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        sheet.getRange(i + 1, 2).setValue(body.kategori);
        sheet.getRange(i + 1, 3).setValue(body.pertanyaan);
        sheet.getRange(i + 1, 4).setValue(body.jawaban);
        sheet.getRange(i + 1, 5).setValue(body.ibarot);
        return outputJSON({success: true});
      }
    }
    return outputJSON({success: false, error: "ID not found"});
  }
  
  if (action === "delete") {
    const id = body.id;
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        sheet.deleteRow(i + 1);
        return outputJSON({success: true});
      }
    }
    return outputJSON({success: false, error: "ID not found"});
  }
}

function outputJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
