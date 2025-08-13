# doGet

return HtmlService.createHtmlOutputFromFile('index');

const htmlOutput = HtmlService.createHtmlOutputFromFile('index');
  console.log(htmlOutput.getContent()); // In ra nội dung HTML dưới dạng chuỗi

console.log(doGet().getContent())

## template
HtmlService
.createTemplateFromFile('Index')
.evaluate();

function doGet() {
  return HtmlService
      .createTemplateFromFile('Index')
      .evaluate();
}