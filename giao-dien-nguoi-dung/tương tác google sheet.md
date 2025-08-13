## tương tác google sheet
Tương tác với đường dẫn (URL) của Google Sheet và sử dụng dữ liệu dựa trên tên sheet là một tính năng mạnh mẽ của Google Apps Script. Bạn có thể thực hiện điều này bằng cách lấy ID của bảng tính từ URL và sau đó sử dụng các phương thức của Apps Script để truy cập vào các sheet cụ thể.

### Các bước thực hiện

1.  **Lấy Spreadsheet ID từ URL:**
    Đầu tiên, bạn cần trích xuất ID của Google Sheet. ID này nằm trong URL giữa `/d/` và `/edit`.

    Ví dụ, với URL: `https://docs.google.com/spreadsheets/d/123abcXYZ_your_spreadsheet_ID_here/edit#gid=0`
    Spreadsheet ID sẽ là: `123abcXYZ_your_spreadsheet_ID_here`.

2.  **Mở Google Sheet bằng ID:**
    Trong Apps Script, bạn sử dụng phương thức `openById()` để mở bảng tính.

    ```javascript
    var spreadsheetId = "123abcXYZ_your_spreadsheet_ID_here";
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    ```

3.  **Sử dụng dữ liệu bằng Tên Sheet:**
    Sau khi đã có đối tượng `spreadsheet`, bạn có thể sử dụng phương thức `getSheetByName()` để chọn sheet mà bạn muốn tương tác.

    ```javascript
    var sheetName = "Tên Sheet của bạn";
    var sheet = spreadsheet.getSheetByName(sheetName);

    // Kiểm tra nếu sheet tồn tại
    if (sheet) {
        // Lấy toàn bộ dữ liệu trong sheet
        var data = sheet.getDataRange().getValues();
        Logger.log(data);
    } else {
        Logger.log("Không tìm thấy sheet có tên: " + sheetName);
    }
    ```

Bạn có thể kết hợp các bước trên để tạo một hàm hoàn chỉnh, cho phép bạn tương tác với bất kỳ Google Sheet nào bạn có quyền truy cập, miễn là bạn có ID và tên sheet chính xác.

## ver 2

Để kết hợp logic từ hàm `getSheetTest()` vào hàm `doGet()` để hiển thị dữ liệu từ Google Sheet lên giao diện web, bạn cần thực hiện các bước sau:

1.  **Chuyển đổi dữ liệu thành chuỗi HTML:** Thay vì chỉ ghi dữ liệu vào log, bạn cần xử lý dữ liệu từ sheet và tạo ra một đoạn mã HTML để hiển thị nó trên trang web.
2.  **Sử dụng `HtmlTemplate` để truyền dữ liệu:** Dùng `HtmlService.createTemplateFromFile()` để tạo một template HTML, sau đó gán dữ liệu vào template đó trước khi đánh giá nó thành chuỗi HTML cuối cùng.

Dưới đây là cách bạn có thể kết hợp hai hàm trên một cách hiệu quả:

-----

### Cập nhật hàm `doGet()`

Trong file **code.js**, bạn sẽ sửa đổi hàm `doGet()` để nó lấy dữ liệu từ Google Sheet và truyền vào template HTML.

```javascript
// giao-dien-nguoi-dung/code.js

function doGet() {
  // sheet id của bạn
  var spreadsheetId = '1J_i0s_3W0a-0iKj4Vw-2eB-jM1u_vC6G8Fk9X'; // Thay bằng ID thực tế của bạn
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);

  // sheet name
  var sheetName = 'Sheet1'; 
  var sheet = spreadsheet.getSheetByName(sheetName);

  var data = [];
  if (sheet) {
    // Lấy toàn bộ dữ liệu từ sheet
    data = sheet.getDataRange().getValues();
  } else {
    // Nếu không tìm thấy sheet, trả về mảng rỗng hoặc thông báo lỗi
    Logger.log('Không tìm thấy sheet có tên: ' + sheetName);
  }

  // Tạo một template từ file 'index'
  var template = HtmlService.createTemplateFromFile('index');
  // Gán biến 'data' vào template
  template.data = data;

  // Đánh giá template và trả về HTML
  return template.evaluate();
}

```

-----

### Cập nhật file `index.html`

Trong file `index.html`, bạn sẽ sử dụng cú pháp đặc biệt của Apps Script để lặp qua mảng dữ liệu và hiển thị nó dưới dạng một bảng HTML.

```html
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
        padding: 8px;
      }
    </style>
  </head>
  <body>
    <h1>Dữ liệu từ Google Sheet</h1>
    <table>
      <thead>
        <tr>
          <? for (var i = 0; i < data[0].length; i++) { ?>
            <th><?= data[0][i] ?></th>
          <? } ?>
        </tr>
      </thead>
      <tbody>
        <? for (var i = 1; i < data.length; i++) { ?>
          <tr>
            <? for (var j = 0; j < data[i].length; j++) { ?>
              <td><?= data[i][j] ?></td>
            <? } ?>
          </tr>
        <? } ?>
      </tbody>
    </table>
  </body>
</html>
```

-----

### Giải thích các điểm chính

  * `template.data = data;`: Đây là cách bạn truyền một biến (`data`) từ **Apps Script** sang **HTML template**. Biến này sẽ có thể truy cập được trong file HTML.
  * `<?= ... ?>`: Cú pháp này được sử dụng để in giá trị của một biến hoặc kết quả của một biểu thức JavaScript trực tiếp vào HTML.
  * `<? ... ?>`: Cú pháp này cho phép bạn viết mã JavaScript trong file HTML, chẳng hạn như vòng lặp `for`.

Bằng cách này, khi bạn triển khai Web App và truy cập URL, hàm `doGet()` sẽ được gọi, lấy dữ liệu từ Google Sheet, và `index.html` sẽ hiển thị dữ liệu đó dưới dạng một bảng trên trang web.