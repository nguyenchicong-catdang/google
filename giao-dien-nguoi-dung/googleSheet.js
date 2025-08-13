// google sheet

function getSheetTest() {
    // sheet id
    var spreadsheetId = '15ZM6ZpNB2Xa0EHG0yDoLksXoagMyPROWAeGFYF1CqB4';
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);

    // sheet name
    var sheetName = 'test';
    var sheet = spreadsheet.getSheetByName(sheetName);

    // kiem tra 
    var data = [];
  if (sheet) {
    data = sheet.getDataRange().getValues();
  } else {
    Logger.log('Không tìm thấy sheet có tên: ' + sheetName);
  }
  Logger.log(data)
  return data;
}