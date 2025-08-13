// in ra chuỗi html
function doGet() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('index');
  console.log(htmlOutput.getContent()); // In ra nội dung HTML dưới dạng chuỗi
  return htmlOutput;
}

// ver 2

// giao-dien-nguoi-dung/code.js

function doGet() {
    return HtmlService.createHtmlOutputFromFile('index');
}

console.log(doGet().getContent())