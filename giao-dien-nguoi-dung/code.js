// giao-dien-nguoi-dung/code.js

function doGet() {
    // Lấy dữ liệu từ Google Sheet bằng cách gọi hàm getSheetData().
  var data = getSheetTest();
  
  // Tạo template từ file HTML và truyền dữ liệu vào.
  var template = HtmlService.createTemplateFromFile('index');
  template.data = data;
  
  return template.evaluate();
}

//console.log(doGet().getContent())
Logger.log(doGet().getContent())